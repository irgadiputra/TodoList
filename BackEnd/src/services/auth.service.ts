import { sign } from "jsonwebtoken";
import prisma from "../lib/prisma";
import { hash, genSaltSync, compare } from "bcryptjs";
import { SECRET_KEY } from "../config";
import { LoginParam, RegisterParam, UpdateProfileParam } from "../type/auth.type";
import { HttpError } from "../utils/httpError";

async function FindUserByEmail(email: string) {
  try {
    const user = await prisma.user.findFirst({
      select: {
        email: true,
        name: true,
        password: true,
        id: true
      },
      where: {
        email,
      },
    });
    return user;
  } catch (err) {
    throw err;
  }
}

async function RegisterService(param: RegisterParam & { referral_code?: string }) {
  try {
    const isExist = await FindUserByEmail(param.email);
    if (isExist) throw new HttpError(409, "Email sudah terdaftar");

    const salt = genSaltSync(10);
    const hashedPassword = await hash(param.password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: param.name,
        email: param.email,
        password: hashedPassword,
        createdAt: new Date(),
      },
    });
  } catch (err) {
    throw err;
  }
}


async function LoginService(param: LoginParam) {
  try {
    const user = await FindUserByEmail(param.email);

    if (!user) throw new HttpError(404, "Email tidak terdaftar");

    const checkPass = await compare(param.password, user.password);

    if (!checkPass) throw new HttpError(401, "Password Salah");

    const payload = {
      email: user.email,
      name: user.name,
      id: user.id
    }

    const token = sign(payload, String(SECRET_KEY), { expiresIn: "1h" });

    return { user: payload, token };
  } catch (err) {
    throw err;
  }
}

async function UpdateProfileService(param: UpdateProfileParam, id: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const updateData: any = {};

    if (param.name) updateData.name = param.name;

    if (param.new_password) {
      if (!param.old_password) {
        throw new Error("Old password is required to set a new password");
      }

      const isMatch = await compare(param.old_password, user.password);
      if (!isMatch) {
        throw new Error("Old password is incorrect");
      }

      const salt = genSaltSync(10);
      const hashedNewPassword = await hash(param.new_password, salt);
      updateData.password = hashedNewPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: updateData,
    });

    const payload = {
      email: updatedUser.email,
      name: updatedUser.name,
      id: updatedUser.id,
    }
    const token = sign(payload, String(SECRET_KEY), { expiresIn: "1h" });

    return { user: payload, token };
  } catch (err) {
    throw err;
  }
}

async function GetAllUserEmailsService() {
  return await prisma.user.findMany({
    select: {
      email: true,
      id: true,
    },
  });
}

async function KeepLoginService(id: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new Error("User not found");
    }
    const payload = {
      email: user.email,
      name: user.name,
      id: user.id,
    }

    const token = sign(payload, String(SECRET_KEY), { expiresIn: "1h" });

    return { user: payload, token };
  } catch (err) {
    throw err;
  }
}



export { FindUserByEmail, RegisterService, LoginService, UpdateProfileService, KeepLoginService, GetAllUserEmailsService };
