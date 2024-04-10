import { it, expect, describe, beforeEach } from 'vitest';
import {
  calculateDiscount,
  canDrive,
  createProduct,
  fetchData,
  getCoupons,
  isPriceInRange,
  isStrongPassword,
  isValidUsername,
  Stack,
  validateUserInput,
} from '../core';

describe('Hello World', () => {
  it('test case', () => {
    const result = 'File not found.';
    expect(result).toBeDefined();
    expect(result).toMatch(/not found/i);

    const result2 = [2, 3, 1];
    expect(result2).toBeDefined();
    expect(result2).toEqual(expect.arrayContaining([1, 2, 3]));
    expect(result2.length).toBeGreaterThan(0);

    const result3 = { name: 'Mosh' };
    expect(result3).toBeDefined();
    expect(result3).toMatchObject({ name: 'Mosh' });
    expect(result3).toHaveProperty('name');
    expect(typeof result3.name).toBe('string');
  });
});

describe('getCoupons', () => {
  const coupons = getCoupons();
  it('should check returns an array with 2 coupons', () => {
    expect(coupons).toBeDefined();
    expect(Array.isArray(coupons)).toBe(true);
    expect(coupons.length).toBeGreaterThan(0);
  });

  it('should Check the structure and values of each coupon', () => {
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('code' && 'discount');
      expect(typeof coupon.code).toBe('string');
      expect(coupon.code).toBeTruthy();
      expect(typeof coupon.discount).toBe('number');
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThanOrEqual(100);
      expect(coupon.discount).not.toBeNaN();
    });
  });
});

describe('calculateDiscount', () => {
  it('should return discounted price if given valid code', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9);
    expect(calculateDiscount(10, 'SAVE20')).toBe(8);
  });

  // handle non-umeric price
  it('should handle non-numeric price', () => {
    expect(calculateDiscount('10', 'SAVE10')).toMatch(/invalid/i);
  });

  // handle negative price
  it('should handle negative price', () => {
    expect(calculateDiscount(-10, 'SAVE10')).toMatch(/invalid/i);
  });

  // handle non-string discount code
  it('should handle non-string discount code', () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
  });

  // handle invalid discount code
  it('should handle invalid discount code', () => {
    expect(calculateDiscount(10, 'INVALID')).toBe(10);
  });
});

describe('validateUserInput', () => {
  // test valid user input
  it('should return success if given valid user input', () => {
    expect(validateUserInput('Mosh', 25)).toMatch(/success/i);
  });

  // test if usernamer is not string
  it('should return error if given invalid username', () => {
    expect(validateUserInput(10, 25)).toMatch(/Invalid/i);
  });

  // test invalid username less than 3 char
  it('should return error if given invalid username less than 3 chars', () => {
    expect(validateUserInput('M', 25)).toMatch(/Invalid/i);
  });

  // test invalid username more than 255 char
  it('should return errof if given invalid username more than 255', () => {
    expect(validateUserInput('M'.repeat(256), 25)).toMatch(/Invalid/i);
  });

  // test if age is not number
  it('should return error if given invalid age', () => {
    expect(validateUserInput('Mosh', '25')).toMatch(/Invalid/i);
  });

  // test invalid age less than 18
  it('should return error if given invalid age less than 18', () => {
    expect(validateUserInput('Mosh', 17)).toMatch(/Invalid/i);
  });

  // test invalid age greater than 100
  it('should return error if given invalid age greater than 100', () => {
    expect(validateUserInput('Mosh', 101)).toMatch(/Invalid/i);
  });

  // test if both username and age are invalid
  it('should return error if both username and age are invalid', () => {
    expect(validateUserInput('', 0)).toMatch(/Invalid username/i);
    expect(validateUserInput('', 0)).toMatch(/Invalid age/i);
  });
});

describe('isPriceInRange', () => {
  it.each([
    { scenario: 'price < min', price: -10, result: false },
    { scenario: 'price equal to min', price: 0, result: true },
    { scenario: 'price between min and max', price: 40, result: true },
    { scenario: 'price > max', price: 101, result: false },
    { scenario: 'price equal to max', price: 100, result: true },
  ])('should return $result if when $scenario', ({ price, result }) => {
    expect(isPriceInRange(price, 0, 100)).toBe(result);
  });
  // return false when price is outside range
  //   it("should return false when price is outside range", () => {
  //     expect(isPriceInRange(-10, 0, 100)).toBe(false);
  //     expect(isPriceInRange(200, 0, 100)).toBe(false);
  //   });

  //   // return true when price is equal to min or max
  //   it("should return false when price is outside range", () => {
  //     expect(isPriceInRange(0, 0, 100)).toBe(true);
  //     expect(isPriceInRange(100, 0, 100)).toBe(true);
  //   });

  //   // return true when price is equal within boundary range
  //   it("should return false when price is outside range", () => {
  //     expect(isPriceInRange(40, 0, 100)).toBe(true);
  //   });
});

describe('isValidUsername', () => {
  const min = 5;
  const max = 15;
  // check if username less or greater than min and max
  it('should return false if username is less than minimum length', () => {
    expect(isValidUsername('a'.repeat(min - 1))).toBe(false);
    expect(isValidUsername('a'.repeat(max + 1))).toBe(false);
  });

  // check if username is equal to min or max
  it('should return false if username is equal to minimum length', () => {
    expect(isValidUsername('a'.repeat(min))).toBe(true);
    expect(isValidUsername('a'.repeat(max))).toBe(true);
  });

  // check if username is valid
  it('should return true if username is valid', () => {
    expect(isValidUsername('a'.repeat(min + 1))).toBe(true);
    expect(isValidUsername('a'.repeat(max - 1))).toBe(true);
  });

  // check if username is invalid
  it('should return false if username is invalid', () => {
    expect(isValidUsername(null)).toBe(false);
  });
});

describe('canDrive', () => {
  // check if countrycode is invalid
  it('should return false if countrycode is invalid', () => {
    expect(canDrive(20, 'FR')).toMatch(/Invalid/i);
  });

  it.each([
    { age: 15, country: 'US', result: false },
    { age: 16, country: 'US', result: true },
    { age: 17, country: 'US', result: true },
    { age: 16, country: 'UK', result: false },
    { age: 17, country: 'UK', result: true },
    { age: 18, country: 'UK', result: true },
  ])('should return $result for $age, $country', ({ age, country, result }) => {
    expect(canDrive(age, country)).toBe(result);
  });
});

describe('fetchData', () => {
  // should return array of numbers
  it('should return promise that will resolve to an array of numbers', async () => {
    try {
      const result = await fetchData();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    } catch (error) {
      expect(error).toHaveProperty('reason');
      expect(error.reason).toMatch(/fail/i);
    }
  });
});

// describe("test suite", () => {
//     beforeAll(() => {
//         console.log("BeforeAll called");
//     })

//     beforeEach(() => {
//         console.log("BeforeEach called");
//     })

//     afterAll(() => {
//         console.log("AfterAll called");
//     })

//     afterEach(() => {
//         console.log("AfterEach called");
//     })

//     it("test suite 1", () => {

//     })

//     it("test suite 2", () => {

//     })
// });

describe('Stack', () => {
  let stack;

  beforeEach(() => {
    stack = new Stack();
  });
  // push should add item to stack
  it('should add item to stack', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.size()).toBe(3);
  });

  //   pop should remove and return top item from stack
  it('should remove and return top item from stack', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.pop()).toBe(3);
    expect(stack.size()).toBe(2);
  });

  //   pop throw error if stack is empty
  it('should throw error if stack is empty', () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });

  // peek should return top item from stack
  it('should return top item from stack', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.peek()).toBe(3);
    expect(stack.size()).toBe(3);
  });

  //   peek throw error if stack is empty
  it('should throw error if stack is empty', () => {
    expect(() => stack.peek()).toThrow(/empty/i);
  });

  // isEmpty should return true if stack is empty
  it('should return true if stack is empty', () => {
    expect(stack.isEmpty()).toBe(true);
  });

  // isEmpty return false if stack is not empty
  it('should return false if stack is not empty', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.isEmpty()).toBe(false);
  });

  // size return number of items in stack
  it('should return number of items in stack', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.size()).toBe(3);
  });

  // clear should remove all item from stack
  it('should remove all item from stack', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.clear();
    expect(stack.size()).toBe(0);
  });
});

describe('createProduct', () => {
  // Test missing price
  it('should return error if price is missing', () => {
    expect(createProduct({ name: 'Test Product', price: 0 })).toMatchObject({
      success: false,
      error: {
        message: expect.stringMatching(/price/i),
        code: expect.stringMatching(/invalid/i),
      },
    });
  });

  // Test missing name
  it('should return error if name is missing', () => {
    expect(createProduct({ name: '', price: 100 })).toMatchObject({
      success: false,
      error: {
        message: expect.stringMatching(/name/i),
        code: expect.stringMatching(/invalid/i),
      },
    });
  });

  // Test if price is greater than 0
  it('should return error if price is less than 0', () => {
    expect(createProduct({ name: 'Test Product', price: -100 })).toMatchObject({
      success: false,
      error: {
        message: expect.stringMatching(/price/i),
        code: expect.stringMatching(/invalid/i),
      },
    });
  });

  // Test if product created
  it('should return success message if product is successfully published', () => {
    expect(createProduct({ name: 'Product 1', price: 100 })).toMatchObject({
      success: true,
      message: expect.stringMatching(/success/i),
    });
  });
});

describe('isStrongPassword', () => {
  it.each([
    // Invalid
    { scenario: 'empty', value: '', result: false }, // Empty password
    { scenario: 'less than 8 char', value: 'weak', result: false }, // Password less than 8 characters
    { scenario: 'onlylowercase', value: 'onlylowercase', result: false }, // Password without lowercase letter
    { scenario: 'ONLYUPPERCASE', value: 'ONLYUPPERCASE', result: false }, // Password without uppercase letter
    {
      scenario: 'NoDigitsOrLowercase',
      value: 'NoDigitsOrLowercase',
      result: false,
    }, // Password without digit letter

    // Valid
    { scenario: 'empty', value: 'StrongP@sw0rd', result: true }, // Strong password
  ])('should return $result if $scenarion', ({ value, result }) => {
    // Test cases for invalid passwords
    expect(isStrongPassword(value)).toBe(result);
  });
});
