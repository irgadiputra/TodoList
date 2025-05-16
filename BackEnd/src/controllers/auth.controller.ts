import { Request, Response, NextFunction } from "express";
import {
  RegisterService,
  LoginService,
  UpdateProfileService,
  KeepLoginService,
} from "../services/auth.service";
import { IUserReqParam } from "../custom";
import { verify } from "jsonwebtoken";


export async function RegisterController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await RegisterService(req.body);

    res.status(200).send({
      message: "Register Berhasil",
    });
  } catch (err) {
    next(err);
  }
}

export async function LoginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await LoginService(req.body);

    res.status(200).cookie("access_token", data.token).send({
      message: "Login Berhasil",
      user: data.user,
    });
  } catch (err) {
    next(err);
  }
}

export async function UpdateProfileController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const file = req.file as Express.Multer.File;
    const { id } = req.user as IUserReqParam;
    const data = await UpdateProfileService(file, req.body, id);

    res.status(200).cookie("access_token", data.token).send({
      message: "update profile berhasil",
      user: data.user.name,
    });
  } catch (err) {
    next(err);
  }
}

export async function KeepLoginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.user as IUserReqParam;
    const data = await KeepLoginService(id);

    res.status(200).cookie("access_token", data.token).send({
      message: "ReLogin Berhasil",
      user: data.user,
    });
  } catch (err) {
    next(err);
  }
}
