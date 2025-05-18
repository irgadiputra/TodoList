import { Request, Response, NextFunction } from "express";
import {
  RegisterService,
  LoginService,
  UpdateProfileService,
  KeepLoginService,
} from "../services/auth.service";
import { IUserReqParam } from "../custom";
import { verify } from "jsonwebtoken";
import { HttpError } from "../utils/httpError";


export async function RegisterController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await RegisterService(req.body);

    res.status(200).send({
        message: "Register Berhasil",
        data,
      });
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.status).send({ message: err.message });
      } else {
        res.status(500).send({ message: "Internal Server Error" });
        next()
      }
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
      token: data.token
    });
  } catch (err) {
    if (err instanceof HttpError) {
      res.status(err.status).send({ message: err.message });
    } else {
      res.status(500).send({ message: "Internal Server Error" });
      next()
    }
  }
}

export async function UpdateProfileController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.user as IUserReqParam;
    const data = await UpdateProfileService(req.body, id);

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
