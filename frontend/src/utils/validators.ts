import {z} from "zod";

export const loginSchema = z.object({
    email:z
    .string()
    .email("Invalid email address"),
    password:z
     .string()
     .min(6,"Password must be at least 6 characters")
})

export const signupSchema = z.object({
    username: z
        .string()
        .min(3,"Username must be at least 3 characters")
        .refine((value) => !/\s/.test(value),
         "Username must not contain spaces"),
    email: z
        .string()
        .email("Invalid email address"),
    password: z
        .string()
        .min(6,"Password must be at least 6 characters")
})

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address")
})

export const resetPasswordSchema = z.object({
    password:z.string().min(6,"Password must be at least 6 characters")
})