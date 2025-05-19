import { Router } from "express";
import { RegisterController, LoginController, UpdateProfileController, KeepLoginController, GetAllUserEmailsController} from "../controllers/auth.controller";
import ReqValidator from "../middlewares/validator.middleware";
import { registerSchema, loginSchema} from "../schemas/auth.schema";
import { VerifyToken, EOGuard } from "../middlewares/auth.middleware";
const router = Router();

router.post("/register", ReqValidator(registerSchema), RegisterController);
router.post("/login", ReqValidator(loginSchema), LoginController);
router.patch("/user", VerifyToken, UpdateProfileController);
router.post("/relogin", VerifyToken, KeepLoginController);
router.get("/email", GetAllUserEmailsController);

export default router;