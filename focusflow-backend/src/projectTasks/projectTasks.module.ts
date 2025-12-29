import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProjectTasksService } from './projectTasks.service';

@Module({
  imports: [PrismaModule],
  providers: [ProjectTasksService],
  exports: [ProjectTasksService],
})
export class ProjectTasksModule {}
