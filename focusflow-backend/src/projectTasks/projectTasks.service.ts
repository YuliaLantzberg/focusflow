import { ConflictException, Injectable } from '@nestjs/common';
import { ProjectStatus, TaskStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectTasksService {
  constructor(private readonly prisma: PrismaService) {}

  async recalcAndPersistProjectStatus(projectId: string) {
    const countsFilter = { projectId, isVisible: true };
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) return;
    const curProjStatus = project.status;
    if (curProjStatus === ProjectStatus.ARCHIVED) {
      throw ConflictException;
    }

    const total = await this.prisma.task.count({
      where: countsFilter,
    });

    const inProgress = await this.prisma.task.count({
      where: { ...countsFilter, status: TaskStatus.IN_PROGRESS },
    });
    const done = await this.prisma.task.count({
      where: { ...countsFilter, status: TaskStatus.DONE },
    });
    const updatedStatus = this.getNextStatusToPersist(curProjStatus, {
      total,
      inProgress,
      done,
    });
    if (updatedStatus !== curProjStatus) {
      await this.prisma.project.update({
        where: { id: projectId },
        data: { status: updatedStatus },
      });
    }
    return updatedStatus;
  }

  private getNextStatusToPersist(
    currentProjectStatus: ProjectStatus,
    counts: { total: number; inProgress: number; done: number },
  ): ProjectStatus {
    let finalProjStatus = currentProjectStatus;
    if (currentProjectStatus === ProjectStatus.ARCHIVED)
      finalProjStatus = ProjectStatus.ARCHIVED;
    else {
      // If all tasks have completed status
      if (counts.total > 0 && counts.done === counts.total)
        finalProjStatus = ProjectStatus.COMPLETED;
      // If any task is in progress
      else if (counts.inProgress > 0) finalProjStatus = ProjectStatus.ACTIVE;
      else if (currentProjectStatus === ProjectStatus.ON_HOLD)
        finalProjStatus = ProjectStatus.ON_HOLD;
      else finalProjStatus = ProjectStatus.PLANNING;
    }
    return finalProjStatus;
  }

  async getProjStatusBeforeOnHold(projectId: string) {
    const countsFilter = { projectId, isVisible: true };
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) return;
    const total = await this.prisma.task.count({
      where: countsFilter,
    });

    const inProgress = await this.prisma.task.count({
      where: { ...countsFilter, status: TaskStatus.IN_PROGRESS },
    });
    const done = await this.prisma.task.count({
      where: { ...countsFilter, status: TaskStatus.DONE },
    });

    let finalProjStatus: ProjectStatus = ProjectStatus.PLANNING;
    // If all tasks have completed status
    if (total > 0 && done === total) finalProjStatus = ProjectStatus.COMPLETED;
    // If any task is in progress
    else if (inProgress > 0) finalProjStatus = ProjectStatus.ACTIVE;
    else finalProjStatus = ProjectStatus.PLANNING;
    return finalProjStatus;
  }
}
