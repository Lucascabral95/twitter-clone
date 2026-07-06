import { z } from 'zod';
import { isPasswordValid } from './passwordRules';

export const registerSchema = z.object({
  nombre: z
    .string()
    .refine(value => value.trim().split(' ').length >= 2, {
      message: 'Debe ingresar un nombre y un apellido',
    }),
  email: z.string().email({ message: 'Debe ser un correo válido' }),
  password: z
    .string()
    .refine(isPasswordValid, {
      message: 'La contraseña no cumple los requisitos exigidos',
    }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
