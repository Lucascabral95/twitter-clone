import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { loginSchema, LoginFormData } from '@/infrastructure/validation';
import { authService } from '@/infrastructure/services/authService.service';

export const useLogin = () => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = form.handleSubmit(async data => {
    const result = await authService.login(data);

    if (result?.success) {
      setIsRedirecting(true);
      router.push('/home');
    } else {
      form.setError('root', { message: result?.error ?? 'Error al iniciar sesion' });
    }
  });

  return { ...form, isRedirecting, onSubmit };
};
