import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { NotesModule } from 'src/notes/notes.module';
import { ProjectTasksModule } from '../projectTasks/projectTasks.module';

@Module({
  imports: [PrismaModule, TasksModule, NotesModule, ProjectTasksModule],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
