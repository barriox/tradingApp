import { z } from "zod";

const operationSchema = z.object({
  username: z.string({
    required_error: "Es necesario un usuario",
  }),
  email: z
    .string({
      required_error: "Es necesario un email",
    })
    .email({
      message: "El formato del email no es válido",
    }),
  password: z.string({
    required_error: "Es necesaria una contraseña",
  }),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export function validateRegister(input) {
  return registerSchema.safeParse(input);
}
export function validateLogin(input) {
  return loginSchema.safeParse(input);
}
