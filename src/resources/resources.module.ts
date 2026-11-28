import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { Resource, ResourceSchema } from './schemas/resource.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { ResourcesControllerAdmin } from './resources.admin.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Resource.name, schema: ResourceSchema },
    ]),
    UsersModule,
  ],
  controllers: [ResourcesController, ResourcesControllerAdmin],
  providers: [ResourcesService],
  exports: [MongooseModule],
})
export class ResourcesModule {}
