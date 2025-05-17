import { TodoStatus } from "@prisma/client";

export type CreateTodoParam = {
    title: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    userId: number;       // Assignee
}

export type UpdateTodoParam = {
    id: number;
    title?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    status?: TodoStatus;
    userId?: number;       // Assignee
};

export type GetTodoListParam = {
    id?: number;
    page?: number;
    limit?: number;
    userId?: number;     // Assignee
    creatorId?: number;  // Creator
    status?: TodoStatus;
};