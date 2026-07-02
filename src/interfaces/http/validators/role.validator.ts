import { z } from "zod";

export const createRoleSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nombre del rol debe tener al menos 2 caracteres"),
    permissions: z.array(z.string()).min(1, "Debe tener al menos un permiso"),
  }),
});

export const updateRoleSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    permissions: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const assignRoleSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "User ID es requerido"),
    roleId: z.string().min(1, "Role ID es requerido"),
  }),
});
