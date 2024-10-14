import { Role, TaskStatus } from "../enums/enum";

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  role: Role;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  due_date: number;
  userId : string;
}

export interface CreateTaskAssignInput {
  createdBy: string;
  assignedTo: string;
  status: TaskStatus;
  taskId: string,
}

export interface CreateNotificationInput {
  message: string;
  isRead: boolean;
  createdAt: Date;
  userId: number;
}

export interface JwtPayload {
  id: number;
  email: string;
}
