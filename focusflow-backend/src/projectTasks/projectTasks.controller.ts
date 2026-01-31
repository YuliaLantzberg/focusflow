import { Body, Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TasksService } from 'src/tasks/tasks.service';
import { ProjectTasksService } from './projectTasks.service';

@UseGuards(JwtAuthGuard)
@Controller('projects/:id/tasks')
export class ProjectsController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly projectTaskService: ProjectTasksService,
  ) {}
}
