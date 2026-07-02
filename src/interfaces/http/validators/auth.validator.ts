import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Password debe tener al menos 8 caracteres"),
    pin: z.string().min(4, "PIN debe tener al menos 4 dígitos").max(6).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Password es requerido"),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token es requerido"),
  }),
});

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token es requerido"),
  }),
});

export const verifyPinSchema = z.object({
  body: z.object({
    pin: z.string().min(4),
  }),
});
