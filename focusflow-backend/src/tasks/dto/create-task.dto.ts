import { TaskStatus, TaskPriority } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
  order?: number;

  @IsOptional()
  @IsNumber()
  estimatedMinutes?: number;

  @IsOptional()
  @IsNumber()
  timeSpentMinutes?: number;

  @IsOptional()
  @IsBoolean()
  isBillable?: boolean;

  @IsOptional()
  @IsNumber()
  cost?: number;
}
