import { TodoStatus } from "@prisma/client";

export type CreateTodoParam = {
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    userId: number;       // Assignee
}

export type UpdateTodoParam = {
    id: number;
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status?: TodoStatus;
    userId?: number;       // Assignee
};

export type GetTodoListParam = {
    id?: number;
    title?: string;
    page?: number;
    limit?: number;
    userId?: number;     // Assignee
    creatorId?: number;  // Creator
    status?: TodoStatus;
};