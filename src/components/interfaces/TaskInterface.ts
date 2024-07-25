export interface Task {
    taskName: string;
    dueDate: string;
    isCompleted: boolean;
    assignedTo: string[];
    taskId?: string;
    createdBy: string; 
    status: string;
  }