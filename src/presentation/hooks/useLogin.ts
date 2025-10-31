import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { LoginCredentials } from '@/infrastructure/interfaces';
import { authService } from '@/infrastructure/services/authService.service';

export const useLogin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(
    async (formData: FormData) => {
      setIsLoading(true);
      
      const credentials: LoginCredentials = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };

      const result = await authService.login(credentials);
      
      if (result?.success) {
        router.push('/adentro');
      }
      
      setIsLoading(false);
    },
    [router]
  );

  return { handleLogin, isLoading };
};
