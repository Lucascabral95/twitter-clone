export interface PasswordRule {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

export const passwordRules: PasswordRule[] = [
  { id: 'minLength', label: 'Al menos 8 caracteres', test: value => value.length >= 8 },
  { id: 'uppercase', label: 'Una letra mayúscula', test: value => /[A-Z]/.test(value) },
  { id: 'lowercase', label: 'Una letra minúscula', test: value => /[a-z]/.test(value) },
  { id: 'number', label: 'Un número', test: value => /[0-9]/.test(value) },
];

export const isPasswordValid = (value: string): boolean =>
  passwordRules.every(rule => rule.test(value));
