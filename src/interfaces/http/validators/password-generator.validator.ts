import { z } from "zod";

export const generatePasswordSchema = z.object({
  body: z.object({
    length: z
      .number()
      .int()
      .min(8, "La longitud mínima es 8")
      .max(64, "La longitud máxima es 64"),
    includeUppercase: z.boolean(),
    includeLowercase: z.boolean(),
    includeNumbers: z.boolean(),
    includeSymbols: z.boolean(),
    excludeSimilarCharacters: z.boolean(),
  }).refine(
    (data) => data.includeUppercase || data.includeLowercase || data.includeNumbers || data.includeSymbols,
    { message: "Debe incluir al menos un tipo de caracter" }
  ),
});

export const evaluatePasswordSchema = z.object({
  body: z.object({
    password: z.string().min(1, "La contraseña no puede estar vacía"),
  }),
});