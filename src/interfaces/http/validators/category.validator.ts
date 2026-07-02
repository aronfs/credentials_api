import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Nombre de categoría requerido"),
    color: z.string().optional(),
    icon: z.string().optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});
