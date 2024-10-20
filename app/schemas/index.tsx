import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string(),
});

export const UsernameSchema = z.object({
  username: z.string().min(1),
});

export const SignUpSchema = z
  .object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().optional(),
    userName: z.string(),
    email: z.string().email().optional(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not Match",
    path: ["confirmPassword"],
  });

export const BookSchema = z.object({
  bookName: z.string().min(3),
  bookType: z.enum(["PUBLIC", "PRIVATE"]),
});
