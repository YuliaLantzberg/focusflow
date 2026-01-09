import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { ProjectStatus, Task, TaskStatus } from '@prisma/client';
import { ProjectTasksService } from 'src/projectTasks/projectTasks.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectTasksService: ProjectTasksService,
  ) {}

  async create(projectId: string, createTaskDto: CreateTaskDto) {
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
    const newTask = await this.prisma.task.create({
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

    await this.projectTasksService.recalcAndPersistProjectStatus(projectId);
    return newTask;
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

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const { dueDate } = updateTaskDto;
    const updatedTask = await this.prisma.task.update({
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
    await this.projectTasksService.recalcAndPersistProjectStatus(
      updatedTask.projectId,
    );
    return updatedTask;
  }

  async remove(id: string) {
    const removedTask = await this.prisma.task.update({
      where: { id },
      data: {
        isVisible: false,
      },
    });
    await this.projectTasksService.recalcAndPersistProjectStatus(
      removedTask.projectId,
    );
    return removedTask;
  }

  async count(projectId: string, filter: GetTasksFilterDto) {
    const { status, includeHidden } = filter;

    return this.prisma.task.count({
      where: {
        ...(projectId && { projectId }),
        ...(status && { status }),
        ...(includeHidden ? {} : { isVisible: true }),
      },
    });
  }

  async move(movingTaskId: string, moveTaskDto: MoveTaskDto) {
    const { status, order, opts } = moveTaskDto;
    const GAP = 100;
    let gapBelow = 0;
    let gapAbove = 0;
    let collision = false;
    let prev: Task | null = null;
    let next: Task | null = null;
    let didRenormalized = false;

    const task = await this.prisma.task.findUnique({
      where: { id: movingTaskId },
    });
    if (!task) return;
    const project = await this.prisma.project.findUnique({
      where: { id: task.projectId },
    });

    if (
      project?.status &&
      project.status === ProjectStatus.ON_HOLD &&
      status !== TaskStatus.BLOCKED &&
      opts &&
      !opts?.resumeIfOnHold
    ) {
      throw new ConflictException({
        code: 'PROJECT_ON_HOLD_CONFIRMATION_REQUIRED',
        message: 'Project is on hold. Confirmation required to continue.',
      });
    }

    const statusChanged = status !== undefined && status !== task.status;

    if (statusChanged && order === undefined)
      throw new BadRequestException('When changing status, order is required');

    const targetStatus: TaskStatus | undefined = status ?? task.status;

    let finalOrder = order;
    const requestedOrder = order;
    const filter = {
      projectId: task.projectId,
      status: targetStatus,
      id: { not: movingTaskId },
    };

    if (requestedOrder !== undefined) {
      // Check if there are tasks within same project and with the same order
      const collisionTask = await this.prisma.task.findFirst({
        where: { ...filter, order: requestedOrder },
      });
      collision = !!collisionTask;

      prev = await this.prisma.task.findFirst({
        where: { ...filter, order: { lt: requestedOrder } },
        orderBy: {
          order: 'desc',
        },
      });

      next = await this.prisma.task.findFirst({
        where: { ...filter, order: { gt: requestedOrder } },
        orderBy: {
          order: 'asc',
        },
      });

      if (prev) gapBelow = requestedOrder - prev.order;
      if (next) gapAbove = next.order - requestedOrder;
    }

    if (
      (requestedOrder !== undefined && requestedOrder <= 0) ||
      collision === true ||
      (prev && gapBelow < GAP) ||
      (next && gapAbove < GAP)
    ) {
      didRenormalized = true;
      await this.renormalizeColumn(task.projectId, targetStatus);
    }

    // find final new order of the moving task
    if (requestedOrder !== undefined) {
      if (didRenormalized) {
        prev = await this.prisma.task.findFirst({
          where: { ...filter, order: { lt: requestedOrder } },
          orderBy: {
            order: 'desc',
          },
        });

        next = await this.prisma.task.findFirst({
          where: { ...filter, order: { gt: requestedOrder } },
          orderBy: {
            order: 'asc',
          },
        });
      }

      if (prev && next) {
        finalOrder = Math.floor((prev.order + next.order) / 2);
      } else if (prev && !next) {
        finalOrder = prev.order + 1000;
      } else if (!prev && next) {
        finalOrder = next.order - 1000;
      } else {
        finalOrder = 1000;
      }
    }

    const movedTask = await this.prisma.task.update({
      where: { id: movingTaskId },
      data: {
        ...(status !== undefined && { status: targetStatus }),
        ...(order !== undefined && { order: finalOrder }),
      },
    });
    await this.projectTasksService.recalcAndPersistProjectStatus(
      movedTask.projectId,
    );
    return movedTask;
  }

  private async renormalizeColumn(
    projectId: string,
    status: TaskStatus,
  ): Promise<void> {
    // fetch tasks for one column (status)
    const statusTasks = await this.prisma.task.findMany({
      where: { projectId, status },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    // For each task at index i, new order is (i + 1) * 1000
    if (statusTasks.length === 0) return;
    const updates = statusTasks.map((task, index) => {
      const newOrder = (index + 1) * 1000;

      return this.prisma.task.update({
        where: { id: task.id },
        data: { order: newOrder },
      });
    });

    await this.prisma.$transaction(updates);
  }
}
