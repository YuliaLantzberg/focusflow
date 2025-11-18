import { TaskStatus } from '@prisma/client';

export class GetTasksFilterDto {
  projectId?: string;
  status?: TaskStatus;
  includeHidden?: boolean;
}
