import { clsx, type ClassValue } from "clsx"
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