import { z } from "zod";

export const createCredentialSchema = z.object({
  body: z.object({
    serviceName: z.string().min(1, "Nombre del servicio es requerido"),
    loginEmail: z.string().email().optional().nullable(),
    username: z.string().optional().nullable(),
    password: z.string().min(1, "Password de la credencial es requerido"),
    categoryId: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    tags: z.array(z.string()).optional(),
    strength: z.number().min(0).max(100).optional(),
  }),
});

export const updateCredentialSchema = z.object({
  body: z.object({
    serviceName: z.string().min(1).optional(),
    loginEmail: z.string().email().optional().nullable(),
    username: z.string().optional().nullable(),
    password: z.string().min(1).optional(),
    categoryId: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    tags: z.array(z.string()).optional(),
    strength: z.number().min(0).max(100).optional(),
  }),
});

export const searchCredentialSchema = z.object({
  query: z.object({
    q: z.string().min(1, "Término de búsqueda requerido"),
    categoryId: z.string().optional(),
    favorite: z.string().optional(),
  }),
});
