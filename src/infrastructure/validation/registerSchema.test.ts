import { registerSchema } from './registerSchema';

describe('registerSchema', () => {
  it('accepts a valid nombre, email and password', () => {
    const result = registerSchema.safeParse({
      nombre: 'Ana Perez',
      email: 'ana@example.com',
      password: 'Password1',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a nombre without an apellido', () => {
    const result = registerSchema.safeParse({
      nombre: 'Ana',
      email: 'ana@example.com',
      password: 'Password1',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({
      nombre: 'Ana Perez',
      email: 'not-an-email',
      password: 'Password1',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a password missing the required character classes', () => {
    const result = registerSchema.safeParse({
      nombre: 'Ana Perez',
      email: 'ana@example.com',
      password: 'onlylowercase',
    });

    expect(result.success).toBe(false);
  });
});
