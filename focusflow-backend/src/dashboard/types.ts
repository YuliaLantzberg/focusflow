import { ProjectStatus } from '@prisma/client';

export type ProjectCard = {
  id: string;
  name: string;
  status: ProjectStatus;
  dueDate: Date | null;
  updatedAt: Date;
  createdAt: Date;
};

export type TaskSignals = {
  overdueTaskCount: number;
  earliestOverdueAt: Date | null;
  nextTaskDueAt: Date | null;
};

export type FocusNowReason =
  | 'OVERDUE_TASK'
  | 'DUE_SOON_TASK'
  | 'OVERDUE_PROJECT'
  | 'DUE_SOON_PROJECT'
  | 'CLOSEST_DUE_DATE'
  | 'NEGLECTED'
  | 'OLDEST_PROJECT';

export type FocusNowEvidence = {
  overdueTaskCount?: number;
  earliestOverdueAt?: string;
  nextTaskDueAt?: string;
  projectDueDate?: string;
};

export type FocusNowResult = {
  project: ProjectCard | null;
  reason: FocusNowReason | null;
  evidence: FocusNowEvidence;
};
