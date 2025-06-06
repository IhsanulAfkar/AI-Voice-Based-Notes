import { clsx, type ClassValue } from "clsx"
import { Session } from "next-auth"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalize = (word: string) => {
  let wordBreaks = word.split(' ')
  return wordBreaks.map(w => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }).join(' ')

}
export function stringifyObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return '';
  }
  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (Array.isArray(obj)) {
    return obj.map(item => stringifyObject(item));
  }

  if (typeof obj === 'object') {
    const result: Record<string, string> = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = stringifyObject(obj[key]);
      }
    }
    return result;
  }

  // For functions, symbols, etc.
  return obj;
}