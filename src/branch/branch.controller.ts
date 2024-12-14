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
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/createBranch.dto';
import { UpdateBranchDto } from './dto/updateBranch.dto';
import { BranchIdDto } from './dto/branchId.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Branch } from './entities/branch.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// @UseGuards(JwtAuthGuard)
@ApiTags('Branch')
@ApiBearerAuth()
@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  async createBranch(
    @Body() createBranchDto: CreateBranchDto,
  ): Promise<Branch> {
    return this.branchService.createBranch(createBranchDto);
  }

  @Get()
  async getAllBranches(): Promise<Branch[]> {
    return this.branchService.getAllBranches();
  }

  @Get(':branchId')
  async getBranchById(@Param() { branchId }: BranchIdDto): Promise<Branch> {
    return this.branchService.getBranchById(branchId);
  }

  @Put(':branchId')
  async updateBranch(
    @Param() { branchId }: BranchIdDto,
    @Body() updateBranchDto: UpdateBranchDto,
  ): Promise<Branch> {
    return this.branchService.updateBranch(branchId, updateBranchDto);
  }

  @Delete(':branchId')
  async deleteBranch(
    @Param() { branchId }: BranchIdDto,
  ): Promise<{ message: string }> {
    return this.branchService.deleteBranch(branchId);
  }
}
