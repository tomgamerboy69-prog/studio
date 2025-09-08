import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseAmount = (amount: string | null): { value: number; unit: string } => {
    if (!amount) return { value: 0, unit: '' };
    const match = amount.match(/^(\d*\.?\d+)\s*([a-zA-Z-]*)$/);
    if (match) {
        const [, value, unit] = match;
        return { value: parseFloat(value), unit: unit.trim() };
    }
    const value = parseFloat(amount);
    return isNaN(value) ? { value: 0, unit: amount.trim() } : { value, unit: '' };
};

export const formatAmount = (value: number, unit: string): string => {
    if (!unit) {
      // Handle pluralization for "unit(s)"
      if (value !== 1) {
        return `${value} units`;
      }
      return `${value} unit`;
    }
    // No "s" for "g", "kg", "ml", "l"
    if (['g', 'kg', 'ml', 'l'].includes(unit.toLowerCase())) {
      return `${value}${unit}`;
    }
    // Add "s" for other units if value is not 1
    if (value !== 1 && !unit.endsWith('s')) {
      return `${value} ${unit}s`;
    }
    return `${value} ${unit}`;
};
