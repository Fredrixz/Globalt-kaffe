import { describe, it, expect } from 'vitest';
import { add } from './add.js';

describe('add', () => {
  it('lägger ihop två tal', () => {
    expect(add(1, 2)).toBe(3);
  });

  it('kastar fel om man matar in strängar istället för tal', () => {
    expect(() => add('abc', 'åäö')).toThrow();
  });
});
