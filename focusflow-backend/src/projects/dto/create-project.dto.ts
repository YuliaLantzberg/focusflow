import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
  IsEmail,
  IsNumberString,
  IsEnum,
} from 'class-validator';
import { ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsString()
  clientCompany?: string;

  @IsOptional()
  @IsString()
  clientContactName?: string;

  @IsOptional()
  @IsEmail()
  clientContactEmail?: string;

  @IsOptional()
  @IsNumberString()
  clientContactPhone?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  budget?: string; // Prisma Decimal -> accept as string

  @IsOptional()
  @IsString()
  colorHex?: string;
}
