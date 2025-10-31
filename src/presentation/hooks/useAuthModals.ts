import { useState, useCallback } from 'react';

export const useAuthModals = () => {
  const [isOpenRegister, setIsOpenRegister] = useState(false);
  const [isOpenLogin, setIsOpenLogin] = useState(false);

  const openRegister = useCallback(() => {
    setIsOpenRegister(true);
  }, []);

  const closeRegister = useCallback(() => {
    setIsOpenRegister(false);
  }, []);

  const openLogin = useCallback(() => {
    setIsOpenLogin(true);
  }, []);

  const closeLogin = useCallback(() => {
    setIsOpenLogin(false);
  }, []);

  return {
    isOpenRegister,
    isOpenLogin,
    openRegister,
    closeRegister,
    openLogin,
    closeLogin,
  };
};
