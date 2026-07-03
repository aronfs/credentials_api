import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(80, "El nombre no puede tener más de 80 caracteres"),
  }),
});

export const changePinSchema = z.object({
  body: z.object({
    currentPin: z.string().min(1, "PIN actual es requerido"),
    newPin: z
      .string()
      .regex(/^\d{4,6}$/, "El nuevo PIN debe tener entre 4 y 6 dígitos"),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
  }),
});