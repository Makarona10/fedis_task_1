import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  IsOptional,
  Min,
  IsBoolean,
} from 'class-validator';
import { OperatingHours, ResourceType } from '../schemas/resource.schema';
import { Transform } from 'class-transformer';


export class GetAllResourcesAdminDTO {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value ? value : 1)
  page: number = 1;
  
  @IsOptional()
  @Transform(({ value }) => value ? value : "desc")
  dateOrder: "asc" | "desc" = "desc"
}

export class SearchResourcesAdminDTO extends GetAllResourcesAdminDTO {
  @IsString()
  name: string;
}

export class FilterResourcesAdminDTO extends GetAllResourcesAdminDTO {
  @IsNumber()
  @Min(1)
  @IsOptional()
  capacity: number;

  @IsOptional()
  type: ResourceType;

  @IsBoolean()
  canReserve: boolean;
}

export class CreateResourceDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  type: ResourceType;

  @IsOptional()
  @IsBoolean()
  canReserve: boolean;

  @IsString()
  @MaxLength(1024)
  description: string

  @IsNotEmpty()
  operatingHours: OperatingHours;
}