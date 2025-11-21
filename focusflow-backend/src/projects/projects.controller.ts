// Libraries
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

// DTOs
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateNoteDto } from 'src/notes/dto/create-note.dto';
import { GetTasksFilterDto } from 'src/tasks/dto/get-tasks-filter.dto';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';

// Services
import { ProjectsService } from './projects.service';
import { TasksService } from 'src/tasks/tasks.service';
import { NotesService } from 'src/notes/notes.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
    private readonly notesService: NotesService,
  ) {}
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Get(':id/tasks')
  getProjectsTasks(@Param('id') id: string, @Body() filter: GetTasksFilterDto) {
    return this.tasksService.findAll(id, filter);
  }

  @Post(':id/tasks')
  createProjectTask(
    @Param('id') id: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(id, createTaskDto);
  }

  @Get(':id/notes')
  getProjectsNotes(@Param('id') id: string) {
    return this.notesService.findAll(id);
  }

  @Post(':id/notes')
  createNoteForProject(
    @Param('id') id: string,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    return this.notesService.create(id, createNoteDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
