export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  nombre: string;
  email: string;
  password: string;
}

export interface ValidationErrors {
  [key: string]: string[] | undefined;
}

export interface CustomError {
  error: string;
  status: number;
}
