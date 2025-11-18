import { TaskStatus } from '@prisma/client';
import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetTasksFilterDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  @IsBoolean()
  includeHidden?: boolean;
}
