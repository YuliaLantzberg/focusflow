import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { MoveTaskDto } from './dto/move-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(projectId, createTaskDto: CreateTaskDto) {
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

  findAll(projectId: string, filter: GetTasksFilterDto) {
    const { status, includeHidden } = filter;

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

  update(id: string, updateTaskDto: UpdateTaskDto) {
    const { dueDate } = updateTaskDto;
    return this.prisma.task.update({
      where: {
        id,
      },
      data: {
        title: updateTaskDto.title,
        description: updateTaskDto.description,
        status: updateTaskDto.status,
        priority: updateTaskDto.priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        order: updateTaskDto.order,
        estimatedMinutes: updateTaskDto.estimatedMinutes,
        timeSpentMinutes: updateTaskDto.timeSpentMinutes,
        isBillable: updateTaskDto.isBillable,
        cost: updateTaskDto.cost,
      },
    });
  }

  remove(id: string) {
    return this.prisma.task.update({
      where: { id },
      data: {
        isVisible: false,
      },
    });
  }

  move(id: string, moveTaskDto: MoveTaskDto) {
    const { status, order } = moveTaskDto;
    return this.prisma.task.update({
      where: { id },
      data: {
        ...(order !== undefined && { order }),
        ...(status !== undefined && { status }),
      },
    });
  }
}
