import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [PrismaModule, ProjectsModule, TasksModule, NotesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
