import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email("Invalid Email Format").trim(),
    password: z.string().nonempty("Password is required"),
    name: z.string().nonempty("First Name is required"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid Email Format").trim(),
    password: z.string().nonempty("Password is required"),
});
