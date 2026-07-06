import { passwordRules, isPasswordValid } from './passwordRules';

describe('passwordRules', () => {
  it('flags missing uppercase, lowercase, number and length individually', () => {
    const results = Object.fromEntries(passwordRules.map(rule => [rule.id, rule.test('abc')]));

    expect(results).toEqual({
      minLength: false,
      uppercase: false,
      lowercase: true,
      number: false,
    });
  });

  it('marks every rule as satisfied for a strong password', () => {
    const results = passwordRules.map(rule => rule.test('Password1'));

    expect(results.every(Boolean)).toBe(true);
  });
});

describe('isPasswordValid', () => {
  it('rejects passwords missing any requirement', () => {
    expect(isPasswordValid('short1A')).toBe(false);
    expect(isPasswordValid('nouppercase1')).toBe(false);
    expect(isPasswordValid('NOLOWERCASE1')).toBe(false);
    expect(isPasswordValid('NoNumberHere')).toBe(false);
  });

  it('accepts a password meeting all requirements', () => {
    expect(isPasswordValid('Password1')).toBe(true);
  });
});
