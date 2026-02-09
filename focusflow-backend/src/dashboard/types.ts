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

interface FocusNowReasonInterface {
  OVERDUE_TASK: FocusNowReason;
  DUE_SOON_TASK: FocusNowReason;
  OVERDUE_PROJECT: FocusNowReason;
  DUE_SOON_PROJECT: FocusNowReason;
  CLOSEST_DUE_DATE: FocusNowReason;
  NEGLECTED: FocusNowReason;
  OLDEST_PROJECT: FocusNowReason;
}
export const FOCUSNOW_REASON: FocusNowReasonInterface = {
  OVERDUE_TASK: 'OVERDUE_TASK',
  DUE_SOON_TASK: 'DUE_SOON_TASK',
  OVERDUE_PROJECT: 'OVERDUE_PROJECT',
  DUE_SOON_PROJECT: 'DUE_SOON_PROJECT',
  CLOSEST_DUE_DATE: 'CLOSEST_DUE_DATE',
  NEGLECTED: 'NEGLECTED',
  OLDEST_PROJECT: 'OLDEST_PROJECT',
};

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

export interface Result {
  generatedAt: string;
  focusNow: FocusNowResult;
}
