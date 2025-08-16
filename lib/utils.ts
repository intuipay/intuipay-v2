import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { RewardShipMethod } from "@intuipay/shared/constants";
import { REWARD_SHIP_METHOD_LABELS } from "@/data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function enumToKeyLabel(enumValue: Record<string, string | number>): Record<string, string> {
  return Object.entries(enumValue).reduce((acc, [key, value]) => {
    acc[ value ] = key;
    return acc;
  }, {} as Record<string, string>);
}

export const getRewardShipMethodLabel = (value: string): string => {
  const entry = Object.entries(RewardShipMethod).find(([key, val]) => 
    (val as number | string).toString() === value && isNaN(Number(key))
  );
  
  if (entry) {
    const key = entry[0] as keyof typeof RewardShipMethod;
    return REWARD_SHIP_METHOD_LABELS[key] || key;
  }
  
  return value;
};

