import { useState, useCallback } from 'react';
import { registerSchema } from '@/infrastructure/validation/registerSchema';

import { RegisterCredentials, ValidationErrors } from '@/infrastructure/interfaces';
import { authService } from '@/infrastructure/services/authService.service';

export const useRegister = (
  onSuccess: () => void,
  onSwitchLogin: () => void
) => {
  const [error, setError] = useState<ValidationErrors>({});
  const [errorSimple, setErrorSimple] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      const credentials: RegisterCredentials = {
        nombre: formData.get('nombre') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };

      // Validar con Zod
      const validation = registerSchema.safeParse(credentials);

      if (!validation.success) {
        setError(validation.error.flatten().fieldErrors);
        setErrorSimple(null);
        return;
      }

      setError({});
      setIsLoading(true);

      const result = await authService.register(credentials);

      if (result?.success) {
        onSuccess();
        onSwitchLogin();
      } else {
        setErrorSimple(result?.error);
      }

      setIsLoading(false);
    },
    [onSuccess, onSwitchLogin]
  );

  return {
    error,
    errorSimple,
    isLoading,
    handleRegister,
  };
};
