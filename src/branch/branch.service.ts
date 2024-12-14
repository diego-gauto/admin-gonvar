import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { CompanyService } from 'src/company/company.service';
import { CreateBranchDto } from './dto/createBranch.dto';
import { UpdateBranchDto } from './dto/updateBranch.dto';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class BranchService extends BaseService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    private readonly companyService: CompanyService,
  ) {
    super();
  }

  // Método para crear una nueva sucursal
  async createBranch(createBranchDto: CreateBranchDto): Promise<Branch> {
    try {
      const company = await this.companyService.getCompanyById(
        createBranchDto.companyId,
      );

      // Verificar si existe otra sucursal en la misma compañía con el mismo nombre o ubicación que no ha sido eliminada lógicamente
      const activeBranch = await this.branchRepository.findOne({
        where: [
          {
            company: { companyId: createBranchDto.companyId },
            name: createBranchDto.name,
            deletedAt: null,
          },
          {
            company: { companyId: createBranchDto.companyId },
            location: createBranchDto.location,
            deletedAt: null,
          },
        ],
      });

      if (activeBranch) {
        throw new ConflictException(
          `A branch with the name "${createBranchDto.name}" or the location "${createBranchDto.location}" already exists for this company.`,
        );
      }

      // Verificar si existe una sucursal eliminada lógicamente con el mismo nombre y ubicación
      const softDeletedBranch = await this.branchRepository.findOne({
        where: {
          company: { companyId: createBranchDto.companyId },
          name: createBranchDto.name,
          location: createBranchDto.location,
          deletedAt: Not(null),
        },
      });

      if (softDeletedBranch) {
        // Reactivar sucursal eliminada lógicamente
        softDeletedBranch.deletedAt = null;
        return await this.branchRepository.save(softDeletedBranch);
      }

      // Crear una nueva sucursal
      const newBranch = this.branchRepository.create({
        ...createBranchDto,
        company,
      });

      return await this.branchRepository.save(newBranch);
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  // Método para obtener todas las sucursales
  async getAllBranches(): Promise<Branch[]> {
    try {
      const branches = await this.branchRepository.find({
        relations: ['company'],
      });

      if (branches.length === 0) {
        throw new NotFoundException('No branches found');
      }

      return branches;
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  // Método para obtener una sucursal por ID
  async getBranchById(branchId: number): Promise<Branch> {
    try {
      const branch = await this.branchRepository.findOne({
        where: { branchId: branchId },
        relations: ['company'],
      });

      if (!branch) {
        throw new NotFoundException(`Branch with ID ${branchId} not found`);
      }

      return branch;
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  // Método para actualizar una sucursal
  async updateBranch(
    branchId: number,
    updateBranchDto: UpdateBranchDto,
  ): Promise<Branch> {
    const branch = await this.branchRepository.findOne({
      where: { branchId: branchId },
      relations: ['company'],
    });

    if (!branch) {
      throw new NotFoundException(`Branch with ID ${branchId} not found`);
    }

    // Verificar si existe otra sucursal en la misma compañía con el mismo nombre o ubicación
    const duplicateBranch = await this.branchRepository.findOne({
      where: {
        company: { companyId: branch.company.companyId },
        name: updateBranchDto.name,
        branchId: Not(branchId), // Asegurarse de no coincidir con la propia sucursal
      },
    });

    if (duplicateBranch) {
      throw new ConflictException(
        `Another branch with the name "${updateBranchDto.name}" already exists for this company.`,
      );
    }

    const duplicateLocation = await this.branchRepository.findOne({
      where: {
        company: { companyId: branch.company.companyId },
        location: updateBranchDto.location,
        branchId: Not(branchId),
      },
    });

    if (duplicateLocation) {
      throw new ConflictException(
        `Another branch with the location "${updateBranchDto.location}" already exists for this company.`,
      );
    }

    Object.assign(branch, updateBranchDto);

    try {
      return await this.branchRepository.save(branch);
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  // Método para eliminar una sucursal (lógicamente)
  async deleteBranch(branchId: number): Promise<{ message: string }> {
    try {
      const result = await this.branchRepository.softDelete(branchId);

      if (result.affected === 0) {
        throw new NotFoundException(`Branch with ID ${branchId} not found`);
      }

      return {
        message: `Branch with id:${branchId} deleted successfully (logically)`,
      };
    } catch (error) {
      this.handleServiceError(error);
    }
  }
}
