import { DataType, ColumnOptions } from '../core/types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Tip kontrolü
export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

export function isDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

export function isObject(value: any): value is object {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

// DataType validasyonu
export function validateDataType(value: any, dataType: DataType): boolean {
  switch (dataType) {
    case 'STRING':
    case 'TEXT':
      return isString(value);
    case 'INTEGER':
      return isNumber(value) && Number.isInteger(value);
    case 'FLOAT':
      return isNumber(value);
    case 'BOOLEAN':
      return isBoolean(value);
    case 'DATE':
    case 'TIME':
    case 'TIMESTAMP':
      return isDate(value) || isString(value);
    case 'JSON':
      try {
        if (isString(value)) {
          JSON.parse(value);
          return true;
        }
        return isObject(value) || isArray(value);
      } catch {
        return false;
      }
    case 'ARRAY':
      return isArray(value);
    case 'OBJECT':
      return isObject(value);
    default:
      return false;
  }
}

// Column validasyonu
export function validateColumn(value: any, options: ColumnOptions): void {
  // Null kontrolü
  if (value === null || value === undefined) {
    if (options.allowNull === false || options.nullable === false) {
      throw new ValidationError(`Value cannot be null`);
    }
    return;
  }

  // Tip kontrolü
  if (!validateDataType(value, options.type)) {
    throw new ValidationError(`Value must be of type ${options.type}`);
  }

  // Length kontrolü
  if (options.length && isString(value)) {
    if (value.length > options.length) {
      throw new ValidationError(`String length cannot exceed ${options.length}`);
    }
  }

  // Precision ve Scale kontrolü (float için)
  if (options.type === 'FLOAT' && isNumber(value)) {
    if (options.precision !== undefined) {
      const valueStr = value.toString();
      const [intPart, decPart] = valueStr.split('.');
      const totalDigits = (intPart?.length || 0) + (decPart?.length || 0);
      
      if (totalDigits > options.precision) {
        throw new ValidationError(`Number precision cannot exceed ${options.precision}`);
      }

      if (options.scale !== undefined && decPart && decPart.length > options.scale) {
        throw new ValidationError(`Number scale cannot exceed ${options.scale}`);
      }
    }
  }
}

// Email validasyonu
export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

// URL validasyonu
export function isURL(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

// Range kontrolü
export function isInRange(value: number, min?: number, max?: number): boolean {
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
}

// Length kontrolü
export function hasValidLength(value: string | any[], min?: number, max?: number): boolean {
  const length = value.length;
  if (min !== undefined && length < min) return false;
  if (max !== undefined && length > max) return false;
  return true;
}

// Pattern kontrolü
export function matchesPattern(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}

// Özel validator
export type CustomValidator = (value: any) => boolean | Promise<boolean>;

export async function runCustomValidator(value: any, validator: CustomValidator): Promise<boolean> {
  return await validator(value);
}

