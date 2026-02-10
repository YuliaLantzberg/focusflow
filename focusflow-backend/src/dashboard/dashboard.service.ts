import { Injectable } from '@nestjs/common';
import { ProjectStatus, TaskStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { FOCUSNOW_REASON } from './types';
import type { ProjectCard, Result, TaskSignals } from './types';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const now = new Date();

    const res: Result = {
      generatedAt: now.toISOString(),
      focusNow: {
        project: null,
        reason: null,
        evidence: {},
      },
    };
    const eligibleProjects: ProjectCard[] =
      await this.getEligibleProjects(userId);
    const eligibleProjectsIds = eligibleProjects.map((project) => project.id);

    const filter = {
      projectId: {
        in: eligibleProjectsIds,
      },
      isVisible: true,
      status: {
        notIn: [TaskStatus.DONE, TaskStatus.BLOCKED],
      },
    };
    if (eligibleProjects.length === 0) return res;
    const overdueByProject = await this.prisma.task.groupBy({
      by: ['projectId'],
      where: {
        ...filter,
        dueDate: {
          not: null,
          lt: now,
        },
      },
      _count: {
        _all: true,
      },
      _min: {
        dueDate: true,
      },
    });
    const futureDueDateByProject = await this.prisma.task.groupBy({
      by: ['projectId'],
      where: {
        ...filter,
        dueDate: {
          not: null,
          gte: now,
        },
      },
      _min: {
        dueDate: true,
      },
    });

    if (overdueByProject.length === 0 && futureDueDateByProject.length === 0)
      return res;
    const signals = new Map<string, TaskSignals>();

    for (const row of overdueByProject) {
      signals.set(row.projectId, {
        overdueTaskCount: row._count._all,
        earliestOverdueAt: row._min.dueDate ?? null,
        nextTaskDueAt: null,
      });
    }

    for (const row of futureDueDateByProject) {
      const prev = signals.get(row.projectId) ?? {
        overdueTaskCount: 0,
        earliestOverdueAt: null,
        nextTaskDueAt: null,
      };

      signals.set(row.projectId, {
        ...prev,
        nextTaskDueAt: row._min.dueDate ?? null,
      });
    }

    const getTaskSignals = (projectId: string): TaskSignals => {
      const taskSignals = signals.get(projectId);
      if (taskSignals) return taskSignals;
      return {
        overdueTaskCount: 0,
        earliestOverdueAt: null,
        nextTaskDueAt: null,
      };
    };

    let bestProject: ProjectCard | null = null;

    let bestOverdueDate: Date | null = null;

    for (const proj of eligibleProjects) {
      const taskSignals = getTaskSignals(proj.id);
      const overdueDate = taskSignals.earliestOverdueAt;
      if (bestProject === null && overdueDate !== null) {
        bestProject = proj;
        bestOverdueDate = overdueDate;
      } else {
        if (
          overdueDate !== null &&
          bestOverdueDate &&
          overdueDate < bestOverdueDate
        ) {
          bestProject = proj;
          bestOverdueDate = overdueDate;
        } else if (overdueDate === bestOverdueDate) {
          if (bestProject && proj.createdAt < bestProject?.createdAt) {
            bestProject = proj;
            bestOverdueDate = overdueDate;
          } else if (bestProject && proj.createdAt === bestProject.createdAt) {
            if (proj.id < bestProject?.id) {
              bestProject = proj;
              bestOverdueDate = overdueDate;
            }
          }
        }
      }
    }
    if (bestProject !== null) {
      const taskSignals = getTaskSignals(bestProject.id);
      res.focusNow.project = bestProject;
      res.focusNow.reason = FOCUSNOW_REASON.OVERDUE_TASK;
      res.focusNow.evidence.overdueTaskCount = taskSignals.overdueTaskCount;
      res.focusNow.evidence.earliestOverdueAt =
        taskSignals.earliestOverdueAt?.toISOString();
    }
    return res;
  }

  async getEligibleProjects(userId: string): Promise<ProjectCard[]> {
    return this.prisma.project.findMany({
      where: {
        ownerId: userId,
        isVisible: true,
        status: {
          in: [ProjectStatus.ACTIVE, ProjectStatus.PLANNING],
        },
      },
      orderBy: { updatedAt: 'asc' },
      select: {
        id: true,
        name: true,
        status: true,
        dueDate: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  }
}
