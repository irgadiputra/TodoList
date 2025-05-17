import { IUser } from "@/lib/redux/features/authSlices";

export interface ITodo {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  quota: number;
  userId: number,
  createdById: number,
  createdAt: string,
  updatedAt: string,
  user: IUser,
  createdBy: IUser
}

export interface IGetTodoListParam {
    page?: number;
    limit?: number;
    userId?: number;     // Assignee
    creatorId?: number;  // Creator
    status?: TodoStatus;
};

export interface ITodoList {
  data: ITodo[],
  paginiation : IPaginationTodo
}

export interface IPaginationTodo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export enum TodoStatus {
  OPEN = "OPEN",
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}