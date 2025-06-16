import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function enumToKeyLabel(enumValue: Record<string, string | number>): Record<string, string> {
  return Object.entries(enumValue).reduce((acc, [key, value]) => {
    acc[ value ] = key;
    return acc;
  }, {} as Record<string, string>);
}
