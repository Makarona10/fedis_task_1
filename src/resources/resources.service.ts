import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Resource, ResourceDocument } from './schemas/resource.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateResourceDTO,
  GetAllResourcesAdminDTO,
} from './dto/resources-admin.dto';
import { isDurationValid } from 'src/common/helpers';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectModel(Resource.name)
    private readonly resourceModel: Model<ResourceDocument>,
  ) {}

  readonly ITEMS_PER_PAGE = 15;

  async getResource(id: string) {
    const resource = await this.resourceModel.findById(id);
    if (!resource) throw new NotFoundException('This resource is not existed');
    return resource;
  }

  async getAllResourcesAdmin(filters: GetAllResourcesAdminDTO) {
    console.log(filters);
    const page = filters.page || 1;
    const results = await this.resourceModel
      .find()
      .sort({ createdAt: filters.dateOrder })
      .skip((page - 1) * this.ITEMS_PER_PAGE)
      .limit(this.ITEMS_PER_PAGE);
    return results;
  }

  async createResource(body: CreateResourceDTO) {
    const isOpenHoursValid = isDurationValid(
      body.operatingHours.openTime,
      body.operatingHours.closeTime,
    );
    if (!isOpenHoursValid)
      throw new BadRequestException(
        'Please make sure to enter valid working hours',
      );
    const similarResource = await this.resourceModel.findOne({
      name: body.name,
    });
    if (similarResource?.name)
      throw new BadRequestException(
        'There is an existing resource with the same name',
      );
    await this.resourceModel.create(body);
    return;
  }
}
