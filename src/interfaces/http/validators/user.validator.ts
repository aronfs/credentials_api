import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Password debe tener al menos 8 caracteres"),
    roleId: z.string().min(1, "Role ID es requerido"),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    pin: z.string().min(4).max(6).optional(),
    roleId: z.string().optional(),
    biometricEnabled: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});
