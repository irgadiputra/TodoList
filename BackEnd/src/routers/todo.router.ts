import { Router } from "express";
import ReqValidator from "../middlewares/validator.middleware";
import { VerifyToken, EOGuard } from "../middlewares/auth.middleware";
import { CreateTodoController, DeleteTodoController, GetTodoListController, UpdateTodoController } from "../controllers/todo.controller";
const router = Router();

router.post("/", VerifyToken, CreateTodoController);
router.patch("/", UpdateTodoController);
router.delete("/:id", DeleteTodoController);
router.get("/", GetTodoListController);

export default router;