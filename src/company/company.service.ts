import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { UpdateCompanyDto } from './dto/updateCompany.dto';
import { UserService } from 'src/user/user.service';
import { BaseService } from 'src/common/services/base.service';
import { UserCompanyRoleService } from 'src/userCompanyRole/userCompanyRole.service';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class CompanyService extends BaseService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @Inject(forwardRef(() => UserCompanyRoleService))
    private readonly userCompanyRoleService: UserCompanyRoleService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly dataSource: DataSource,
  ) {
    super();
  }
  // Método para crear una nueva empresa
  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { userId, name, logoUrl } = createCompanyDto;

      // Verificar si el usuario existe
      const userExisting = await this.userService.getUserById(userId);

      // Verifica si el usuario ya es dueño de alguna compañía
      const isOwner = await this.userCompanyRoleService.isUserOwner(userId);

      if (isOwner) {
        throw new BadRequestException(
          'El usuario ya es propietario de una compañía.',
        );
      }

      const ownerIdRole = await this.roleService.getIdRoleByName('owner');

      if (!ownerIdRole) {
        throw new BadRequestException(
          'El rol "owner" no existe en el sistema.',
        );
      }

      // Crear la nueva compañía (sin relación directa con el usuario)
      const newCompany = this.companyRepository.create({
        name,
        logoUrl,
      });

      // Guardar la compañía en la base de datos
      const savedCompany = await queryRunner.manager.save(Company, newCompany);

      // Crear el registro en `UserCompanyRole` para asociar al usuario como propietario
      await this.userCompanyRoleService.createUserCompanyRoleTransaction(
        {
          userId: userId,
          companyId: savedCompany.companyId,
          roleId: ownerIdRole,
        },
        queryRunner,
      );
      await queryRunner.commitTransaction();

      return savedCompany;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleServiceError(error);
    } finally {
      await queryRunner.release();
    }
  }

  // Método para obtener todas las empresas
  async getAllCompanies(): Promise<Company[]> {
    try {
      const companies = await this.companyRepository.find({
        relations: ['branches'],
      });

      if (companies.length === 0) {
        const logMessage = 'No companies found';
        console.warn(logMessage); // Usar warn para registrar que no se encontraron empresas
        throw new NotFoundException(logMessage); // Lanzar la excepción correspondiente
      }

      return companies;
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  // Método para obtener una empresa por ID
  async getCompanyById(companyId: number): Promise<Company> {
    try {
      const existingCompany = await this.companyRepository.findOne({
        where: { companyId: companyId },
        relations: ['branches'],
      });
      if (!existingCompany) {
        const logMessage = `Company with ID ${companyId} not found`;
        console.warn(logMessage); // Usar warn para registrar que no se encontró la empresa
        throw new NotFoundException(logMessage); // Lanzar la excepción correspondiente
      }
      return existingCompany;
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  // Método para actualizar una empresa
  async updateCompany(
    companyId: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    // Busca la empresa existente
    const existingCompany = await this.companyRepository.findOneBy({
      companyId: companyId,
    });
    if (!existingCompany) {
      const logMessage = `Company with ID ${companyId} not found`;
      console.warn(logMessage); // Usar warn para registrar que no se encontró la empresa
      throw new NotFoundException(logMessage); // Lanzar la excepción correspondiente
    }

    // Actualiza las propiedades de la empresa existente con los nuevos datos
    Object.assign(existingCompany, updateCompanyDto);

    try {
      // Guarda los cambios en la base de datos
      return await this.companyRepository.save(existingCompany);
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  // Método para eliminar una empresa (lógicamente)
  async deleteCompany(companyId: number): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const company = await this.companyRepository.findOne({
        where: { companyId },
        relations: ['memberships'],
      });

      if (!company) {
        const logMessage = `Company with ID ${companyId} not found`;
        console.warn(logMessage);
        throw new NotFoundException(logMessage);
      }

      // Aplicar borrado lógico en cascada
      await company.applySoftDeleteCascade(new Date());

      // Guardar los cambios en cascada
      await queryRunner.manager.save(company);
      await queryRunner.manager.save(company.memberships);

      await queryRunner.commitTransaction();

      return {
        message: `Company with ID ${companyId} deleted successfully (logically)`,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleServiceError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async isUserOwner(userId: string): Promise<boolean> {
    return this.userCompanyRoleService.isUserOwner(userId);
  }
}
