import prisma from "../lib/prisma";
import { CreateTodoParam, GetTodoListParam, UpdateTodoParam } from "@/type/todo.type";

export async function CreateTodoService(userId: number, param: CreateTodoParam) {
  try {
    const [assignee, creator] = await Promise.all([
      prisma.user.findUnique({ where: { id: Number(param.userId) } }),
      prisma.user.findUnique({ where: { id: Number(userId) } }),
    ]);

    if (!assignee) throw new Error("Assigned user not found");
    if (!creator) throw new Error("Creator user not found");

    const todo = await prisma.todo.create({
      data: {
        title: param.title,
        description: param.description,
        startDate: param.startDate ? new Date(`${param.startDate}T00:00:00Z`) : undefined,
        endDate: param.endDate ? new Date(`${param.endDate}T00:00:00Z`) : undefined,
        userId: param.userId,
        createdById: userId,
      },
    });

    return todo;
  } catch (err) {
    throw err;
  }
}

export async function UpdateTodoService(param: UpdateTodoParam) {
  try {
    const existingTodo = await prisma.todo.findUnique({
      where: { id: param.id },
    });

    if (!existingTodo) throw new Error("Todo not found");

    const data = {
      ...(param.title && { title: param.title }),
      ...(param.description && { description: param.description }),
      ...(param.startDate && { startDate: new Date(`${param.startDate}T00:00:00Z`) }),
      ...(param.endDate && { endDate: new Date(`${param.endDate}T00:00:00Z`) }),
      ...(param.status && { status: param.status }),
      ...(param.userId && { userId: param.userId }),
    };

    const updatedTodo = await prisma.todo.update({
      where: { id: param.id },
      data,
    });

    return updatedTodo;
  } catch (err) {
    throw err;
  }
}

export async function DeleteTodoService(id: number) {
  try {
    const existingTodo = await prisma.todo.findUnique({
      where: { id: id },
    });

    if (!existingTodo) throw new Error("Todo not found");

    await prisma.todo.delete({
      where: { id: id },
    });

  } catch (err) {
    throw err;
  }
}

import { Prisma } from '@prisma/client';

export async function GetTodoListService(param: GetTodoListParam) {
  try {
    const page = param.page ?? 1;
    const limit = param.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(param.id && { id: param.id }),
      ...(param.title && {
        title: {
          contains: param.title,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
      ...(param.userId && { userId: param.userId }),
      ...(param.creatorId && { createdById: param.creatorId }),
      ...(param.status && { status: param.status }),
    };

    const [todos, total] = await prisma.$transaction([
      prisma.todo.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          user: { select: { name: true, email: true } },
          createdBy: { select: { name: true, email: true } },
        },
      }),
      prisma.todo.count({ where }),
    ]);

    return {
      data: todos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    throw err;
  }
}
