import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { GetTasksFilterDto } from 'src/tasks/dto/get-tasks-filter.dto';
import { TasksService } from 'src/tasks/tasks.service';

@UseGuards(JwtAuthGuard)
@Controller('projects/id/tasks')
export class ProjectsController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getProjectsTasks(@Param('id') id: string, @Body() filter: GetTasksFilterDto) {
    return this.tasksService.findAll(id, filter);
  }

  @Post()
  createProjectTask(
    @Param('id') id: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(id, createTaskDto);
  }
}
