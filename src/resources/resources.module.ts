import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { Resource, ResourceSchema } from './schemas/resource.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Resource.name, schema: ResourceSchema },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class ResourcesModule {}
