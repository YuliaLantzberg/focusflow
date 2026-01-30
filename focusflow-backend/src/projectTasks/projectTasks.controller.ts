import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { GetTasksFilterDto } from 'src/tasks/dto/get-tasks-filter.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { ProjectTasksService } from './projectTasks.service';

@UseGuards(JwtAuthGuard)
@Controller('projects/id/tasks')
export class ProjectsController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly projectTaskService: ProjectTasksService,
  ) {}

  @Get()
  getProjectsTasks(@Param('id') id: string, @Body() filter: GetTasksFilterDto) {
    return this.tasksService.findAll(id, filter);
  }

  @Get('/count')
  getProjectsTasksCount(
    @Param('id') id: string,
    @Body() filter: GetTasksFilterDto,
  ) {
    return this.tasksService.count(id, filter);
  }

  @Get('/proj-status-no-onhold')
  getProjectInitialStatus(@Param('id') id: string) {
    return this.projectTaskService.getProjStatusBeforeOnHold(id);
  }

  @Post()
  createProjectTask(
    @Param('id') id: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(id, createTaskDto);
  }
}
