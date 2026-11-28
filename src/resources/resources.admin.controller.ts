import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { resObj } from 'src/common/helpers';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import {
  CreateResourceDTO,
  GetAllResourcesAdminDTO,
} from './dto/resources-admin.dto';
import { IsUserActiveGuard } from 'src/auth/guards/is-user-active.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, AdminGuard, IsUserActiveGuard)
@Controller('resources/admin')
export class ResourcesControllerAdmin {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get('all')
  async getAllResources(@Query() filters: GetAllResourcesAdminDTO) {
    const resources = await this.resourcesService.getAllResourcesAdmin(filters);
    return resObj(200, 'Resources retrieved successfully', resources);
  }

  @Get('/:id')
  async getResource(id: string) {
    const resource = await this.resourcesService.getResource(id);
    return resObj(200, 'Resource retrieved successfully', resource);
  }

  @Post()
  async createResource(@Body() body: CreateResourceDTO) {
    await this.resourcesService.createResource(body);
    return resObj(201, 'Resource Created Successfully');
  }
}
