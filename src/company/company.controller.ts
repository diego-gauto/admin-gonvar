import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { UpdateCompanyDto } from './dto/updateCompany.dto';
import { CompanyIdDto } from './dto/companyId.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Company } from './entities/company.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Company')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<Company> {
    return this.companyService.createCompany(createCompanyDto);
  }

  @Get()
  async getAllCompanies(): Promise<Company[]> {
    return this.companyService.getAllCompanies();
  }

  @Get(':companyId')
  async getCompanyById(@Param() { companyId }: CompanyIdDto): Promise<Company> {
    return this.companyService.getCompanyById(companyId);
  }

  @Put(':companyId')
  async updateCompany(
    @Param() { companyId }: CompanyIdDto,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companyService.updateCompany(companyId, updateCompanyDto);
  }

  @Delete(':companyId')
  async deleleCompany(
    @Param() { companyId }: CompanyIdDto,
  ): Promise<{ message: string }> {
    return this.companyService.deleteCompany(companyId);
  }
}
