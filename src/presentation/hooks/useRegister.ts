import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { registerSchema, RegisterFormData } from '@/infrastructure/validation';
import { authService } from '@/infrastructure/services/authService.service';

export const useRegister = (onSuccess: () => void) => {
  const router = useRouter();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = form.handleSubmit(async data => {
    const result = await authService.register(data);

    if (result?.success) {
      onSuccess();
      router.push('/home');
    } else {
      form.setError('root', { message: result?.error ?? 'Error al crear la cuenta' });
    }
  });

  return { ...form, onSubmit };
};
