import { Request, Response, NextFunction } from "express";
import { IUserReqParam } from "../custom";
import { verify } from "jsonwebtoken";
import { CreateTodoService, DeleteTodoService, GetTodoListService, UpdateTodoService } from "../services/todo.service";
import { TodoStatus } from "@prisma/client";
import { GetTodoListParam } from "@/type/todo.type";

export async function CreateTodoController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.user as IUserReqParam;
    const todo = await CreateTodoService(id, req.body);

    res.status(200).send({
      message: "Todo created",
      data : todo
    });
  } catch (err) {
    next(err);
  }
}

export async function UpdateTodoController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const todo = await UpdateTodoService(req.body);

    res.status(200).send({
      message: "Todo updated",
      data : todo
    });
  } catch (err) {
    next(err);
  }
}

export async function DeleteTodoController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const eventId = parseInt(req.params.id);
    await DeleteTodoService(eventId);

    res.status(200).send({
      message: "Todo Deleted"
    });
  } catch (err) {
    next(err);
  }
}

export async function GetTodoListController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    const Todo = await GetTodoListService(parseGetTodoListParams(req));
    res.status(200).json({
      message: "Todo list",
      data: Todo,
    });
  } catch (err) {
    next(err);
  }
}

function parseGetTodoListParams(req: Request) : GetTodoListParam {
  const { page, limit, userId, creatorId, status } = req.query;

  return {
    page: page ? parseInt(page as string, 10) : undefined,
    limit: limit ? parseInt(limit as string, 10) : undefined,
    userId: userId ? parseInt(userId as string, 10) : undefined,
    creatorId: creatorId ? parseInt(creatorId as string, 10) : undefined,
    status: status as TodoStatus | undefined, // Optional: validate enum here
  };
}