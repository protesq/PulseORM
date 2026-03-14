import {
  ValidationError,
  isString,
  isNumber,
  isBoolean,
  isDate,
  isObject,
  isArray,
  validateDataType,
  validateColumn,
  isEmail,
  isURL,
  isInRange,
  hasValidLength,
  matchesPattern,
  runCustomValidator
} from '../validators';
import { DataType, ColumnOptions } from '../../core/types';

describe('ValidationError', () => {
  test('should create ValidationError with correct message', () => {
    const error = new ValidationError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('ValidationError');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('Type Checkers', () => {
  describe('isString', () => {
    test('should return true for strings', () => {
      expect(isString('test')).toBe(true);
      expect(isString('')).toBe(true);
    });

    test('should return false for non-strings', () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
    });
  });

  describe('isNumber', () => {
    test('should return true for numbers', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-123.45)).toBe(true);
    });

    test('should return false for non-numbers', () => {
      expect(isNumber('123')).toBe(false);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
    });
  });

  describe('isBoolean', () => {
    test('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    test('should return false for non-booleans', () => {
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean('true')).toBe(false);
      expect(isBoolean(null)).toBe(false);
    });
  });

  describe('isDate', () => {
    test('should return true for valid dates', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date('2024-01-01'))).toBe(true);
    });

    test('should return false for invalid dates and non-dates', () => {
      expect(isDate(new Date('invalid'))).toBe(false);
      expect(isDate('2024-01-01')).toBe(false);
      expect(isDate(null)).toBe(false);
    });
  });

  describe('isObject', () => {
    test('should return true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ key: 'value' })).toBe(true);
    });

    test('should return false for non-objects', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject([])).toBe(false);
      expect(isObject('test')).toBe(false);
    });
  });

  describe('isArray', () => {
    test('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
    });

    test('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false);
      expect(isArray('test')).toBe(false);
      expect(isArray(null)).toBe(false);
    });
  });
});

describe('validateDataType', () => {
  test('should validate STRING type', () => {
    expect(validateDataType('test', 'STRING')).toBe(true);
    expect(validateDataType(123, 'STRING')).toBe(false);
  });

  test('should validate TEXT type', () => {
    expect(validateDataType('long text', 'TEXT')).toBe(true);
    expect(validateDataType(123, 'TEXT')).toBe(false);
  });

  test('should validate INTEGER type', () => {
    expect(validateDataType(123, 'INTEGER')).toBe(true);
    expect(validateDataType(123.45, 'INTEGER')).toBe(false);
    expect(validateDataType('123', 'INTEGER')).toBe(false);
  });

  test('should validate FLOAT type', () => {
    expect(validateDataType(123.45, 'FLOAT')).toBe(true);
    expect(validateDataType(123, 'FLOAT')).toBe(true);
    expect(validateDataType('123.45', 'FLOAT')).toBe(false);
  });

  test('should validate BOOLEAN type', () => {
    expect(validateDataType(true, 'BOOLEAN')).toBe(true);
    expect(validateDataType(false, 'BOOLEAN')).toBe(true);
    expect(validateDataType(1, 'BOOLEAN')).toBe(false);
  });

  test('should validate DATE type', () => {
    expect(validateDataType(new Date(), 'DATE')).toBe(true);
    expect(validateDataType('2024-01-01', 'DATE')).toBe(true);
    expect(validateDataType(123, 'DATE')).toBe(false);
  });

  test('should validate JSON type', () => {
    expect(validateDataType('{"key": "value"}', 'JSON')).toBe(true);
    expect(validateDataType({ key: 'value' }, 'JSON')).toBe(true);
    expect(validateDataType([1, 2, 3], 'JSON')).toBe(true);
    expect(validateDataType('invalid json', 'JSON')).toBe(false);
  });

  test('should validate ARRAY type', () => {
    expect(validateDataType([1, 2, 3], 'ARRAY')).toBe(true);
    expect(validateDataType([], 'ARRAY')).toBe(true);
    expect(validateDataType({}, 'ARRAY')).toBe(false);
  });

  test('should validate OBJECT type', () => {
    expect(validateDataType({ key: 'value' }, 'OBJECT')).toBe(true);
    expect(validateDataType({}, 'OBJECT')).toBe(true);
    expect(validateDataType([], 'OBJECT')).toBe(false);
  });
});

describe('validateColumn', () => {
  test('should allow null values when allowNull is true', () => {
    const options: ColumnOptions = { type: 'STRING', allowNull: true };
    expect(() => validateColumn(null, options)).not.toThrow();
  });

  test('should throw error for null values when allowNull is false', () => {
    const options: ColumnOptions = { type: 'STRING', allowNull: false };
    expect(() => validateColumn(null, options)).toThrow(ValidationError);
    expect(() => validateColumn(null, options)).toThrow('Value cannot be null');
  });

  test('should throw error for null values when nullable is false', () => {
    const options: ColumnOptions = { type: 'STRING', nullable: false };
    expect(() => validateColumn(null, options)).toThrow(ValidationError);
  });

  test('should validate value type', () => {
    const options: ColumnOptions = { type: 'STRING' };
    expect(() => validateColumn('test', options)).not.toThrow();
    expect(() => validateColumn(123, options)).toThrow('Value must be of type STRING');
  });

  test('should validate string length', () => {
    const options: ColumnOptions = { type: 'STRING', length: 5 };
    expect(() => validateColumn('test', options)).not.toThrow();
    expect(() => validateColumn('toolong', options)).toThrow('String length cannot exceed 5');
  });

  test('should validate float precision', () => {
    const options: ColumnOptions = { type: 'FLOAT', precision: 5 };
    expect(() => validateColumn(123.45, options)).not.toThrow();
    expect(() => validateColumn(123456.78, options)).toThrow('Number precision cannot exceed 5');
  });

  test('should validate float scale', () => {
    const options: ColumnOptions = { type: 'FLOAT', precision: 5, scale: 2 };
    expect(() => validateColumn(123.45, options)).not.toThrow();
    expect(() => validateColumn(12.456, options)).toThrow('Number scale cannot exceed 2');
  });

  test('should allow undefined with default allowNull behavior', () => {
    const options: ColumnOptions = { type: 'STRING' };
    expect(() => validateColumn(undefined, options)).not.toThrow();
  });
});

describe('isEmail', () => {
  test('should return true for valid emails', () => {
    expect(isEmail('test@example.com')).toBe(true);
    expect(isEmail('user.name@domain.co.uk')).toBe(true);
    expect(isEmail('user+tag@example.com')).toBe(true);
  });

  test('should return false for invalid emails', () => {
    expect(isEmail('invalid')).toBe(false);
    expect(isEmail('test@')).toBe(false);
    expect(isEmail('@example.com')).toBe(false);
    expect(isEmail('test @example.com')).toBe(false);
  });
});

describe('isURL', () => {
  test('should return true for valid URLs', () => {
    expect(isURL('https://example.com')).toBe(true);
    expect(isURL('http://localhost:3000')).toBe(true);
    expect(isURL('ftp://files.example.com')).toBe(true);
  });

  test('should return false for invalid URLs', () => {
    expect(isURL('not a url')).toBe(false);
    expect(isURL('example.com')).toBe(false);
    expect(isURL('')).toBe(false);
  });
});

describe('isInRange', () => {
  test('should validate number within range', () => {
    expect(isInRange(5, 0, 10)).toBe(true);
    expect(isInRange(0, 0, 10)).toBe(true);
    expect(isInRange(10, 0, 10)).toBe(true);
  });

  test('should return false for numbers outside range', () => {
    expect(isInRange(-1, 0, 10)).toBe(false);
    expect(isInRange(11, 0, 10)).toBe(false);
  });

  test('should work with only min or max', () => {
    expect(isInRange(5, 0, undefined)).toBe(true);
    expect(isInRange(5, undefined, 10)).toBe(true);
    expect(isInRange(-1, 0, undefined)).toBe(false);
    expect(isInRange(11, undefined, 10)).toBe(false);
  });
});

describe('hasValidLength', () => {
  test('should validate string length', () => {
    expect(hasValidLength('test', 2, 5)).toBe(true);
    expect(hasValidLength('test', 4, 4)).toBe(true);
    expect(hasValidLength('t', 2, 5)).toBe(false);
    expect(hasValidLength('toolong', 2, 5)).toBe(false);
  });

  test('should validate array length', () => {
    expect(hasValidLength([1, 2, 3], 2, 5)).toBe(true);
    expect(hasValidLength([1], 2, 5)).toBe(false);
    expect(hasValidLength([1, 2, 3, 4, 5, 6], 2, 5)).toBe(false);
  });

  test('should work with only min or max', () => {
    expect(hasValidLength('test', 2, undefined)).toBe(true);
    expect(hasValidLength('test', undefined, 5)).toBe(true);
  });
});

describe('matchesPattern', () => {
  test('should match valid patterns', () => {
    expect(matchesPattern('abc123', /^[a-z0-9]+$/)).toBe(true);
    expect(matchesPattern('test@example.com', /^[^\s@]+@[^\s@]+\.[^\s@]+$/)).toBe(true);
  });

  test('should not match invalid patterns', () => {
    expect(matchesPattern('ABC', /^[a-z]+$/)).toBe(false);
    expect(matchesPattern('test', /^\d+$/)).toBe(false);
  });
});

describe('runCustomValidator', () => {
  test('should run sync custom validator', async () => {
    const validator = (value: any) => value > 10;
    expect(await runCustomValidator(15, validator)).toBe(true);
    expect(await runCustomValidator(5, validator)).toBe(false);
  });

  test('should run async custom validator', async () => {
    const validator = async (value: any) => {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(value === 'test'), 10);
      });
    };
    expect(await runCustomValidator('test', validator)).toBe(true);
    expect(await runCustomValidator('other', validator)).toBe(false);
  });
});

