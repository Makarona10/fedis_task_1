import { Controller, Get, HttpException } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { resObj } from 'src/common/helpers';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get(':id')
  async getResource(id: string) {
    try {
      const resource = await this.resourcesService.getResource(id);
      return resObj(200, 'Resource retrieved successfully', resource);
    } catch (error: any) {
      throw new HttpException(error.message, error.statusCode);
    }
  }
}
