import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Debe ser un correo válido' }),
  password: z.string().min(1, { message: 'Ingresá tu contraseña' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
