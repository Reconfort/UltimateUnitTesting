import { describe, it, expect } from 'vitest';
import { calculateAverage, factorial, fizzBuzz, max } from '../intro';

describe('max', () => {
  it('should return the largest value', () => {
    expect(max(2, 1)).toBe(2);
  });

  it("should return the second args if it's greater", () => {
    expect(max(1, 2)).toBe(2);
  });

  it('should return first args if args is equall', () => {
    expect(max(1, 1)).toBe(1);
  });
});

describe('fizzbuzz', () => {
  it('should return FizzBuzz  args divisible by 3 and 5', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz');
  });

  it('should return Fizz  args divisible by 3', () => {
    expect(fizzBuzz(3)).toBe('Fizz');
  });

  it('should return Buzz  args divisible by 5', () => {
    expect(fizzBuzz(5)).toBe('Buzz');
  });

  it('should return args as string if not divisible by 3 or 5', () => {
    expect(fizzBuzz(1)).toBe('1');
  });
});

describe('calculateAverage', () => {
  it('should return the NaN if given empty array', () => {
    expect(calculateAverage([])).toBe(NaN);
  });

  it('should calucluate average of the given array with single element', () => {
    expect(calculateAverage([1])).toBe(1);
  });

  it('should calucluate average of the given array with two single element', () => {
    expect(calculateAverage([1, 5])).toBe(3);
  });

  it('should calucluate average of the given array with three single element', () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});

describe('factorial', () => {
  it('should return 1 if given 0 or 1', () => {
    expect(factorial(0)).toBe(1);
  });

  it('should return 6 if given 3', () => {
    expect(factorial(3)).toBe(6);
  });

  it('should return 24 if given 4', () => {
    expect(factorial(4)).toBe(24);
  });

  it('should return undefined if goven negative number', () => {
    expect(factorial(-1)).toBe(undefined);
  });
});
