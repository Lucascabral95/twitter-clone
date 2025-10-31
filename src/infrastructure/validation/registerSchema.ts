import { z } from 'zod';

export const registerSchema = z.object({
  nombre: z
    .string()
    .refine(value => value.trim().split(' ').length >= 2, {
      message: 'Debe ingresar un nombre y un apellido',
    }),
  email: z.string().email({ message: 'Debe ser un correo válido' }),
  password: z
    .string()
    .min(8, { message: 'Debe tener al menos 8 caracteres' })
    .refine(value => /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value), {
      message: 'Debe tener mayúscula, minúscula y número',
    }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
