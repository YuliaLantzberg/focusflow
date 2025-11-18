import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto) {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      order,
      estimatedMinutes,
      timeSpentMinutes,
      isBillable,
      cost,
      projectId,
    } = createTaskDto;
    return this.prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        order,
        estimatedMinutes,
        timeSpentMinutes,
        isBillable,
        cost,
        project: {
          connect: { id: projectId },
        },
      },
    });
  }

  findAll(filter: GetTasksFilterDto) {
    const { projectId, status } = filter;

    // includeHidden may come as boolean or string from query, be defensive
    const includeHidden =
      (filter as any).includeHidden === true ||
      (filter as any).includeHidden === 'true';

    return this.prisma.task.findMany({
      where: {
        ...(projectId && { projectId }),
        ...(status && { status }),
        ...(includeHidden ? {} : { isVisible: true }),
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.task.findUnique({ where: { id, isVisible: true } });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
