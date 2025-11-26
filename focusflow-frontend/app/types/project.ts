export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  clientCompany?: string | null;
  dueDate?: string | null;
}
