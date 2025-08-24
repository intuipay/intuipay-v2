import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { RewardShipMethod } from '@intuipay/shared/constants';
import { REWARD_SHIP_METHOD_LABELS } from '@/data';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function enumToKeyLabel(enumValue: Record<string, string | number>): Record<string, string> {
  return Object.entries(enumValue).reduce((acc, [key, value]) => {
    acc[ value ] = key;
    return acc;
  }, {} as Record<string, string>);
}

export const getEnumKey = <T extends Record<string, string | number>>(
  enumValue: T, 
  value: string | number
): keyof T | string => {
  const entry = Object.entries(enumValue).find(([key, val]) => 
    (val as number | string).toString() === value.toString() && isNaN(Number(key))
  );
  return entry ? entry[ 0 ] : value.toString();
};

// Shared helper to find enum entry by value, filtering out numeric keys
function findEnumEntryByValue<T extends Record<string, string | number>>(
  enumValue: T,
  value: string | number
): [string, string | number] | undefined {
  return Object.entries(enumValue).find(([key, val]) =>
    (val as number | string).toString() === value.toString() && isNaN(Number(key))
  );
}

export const getRewardShipMethodLabel = (value: string): string => {
  const entry = findEnumEntryByValue(RewardShipMethod, value);
  
  if (entry) {
    const key = entry[ 0 ] as keyof typeof RewardShipMethod;
    return REWARD_SHIP_METHOD_LABELS[ key ] || key;
  }
  
  return value;
};

export function formatTimeAgo(doneAt: string | null): string {
  if (!doneAt) return '';
  
  const doneDate = dayjs(doneAt);
  const now = dayjs();
  const diffInDays = now.diff(doneDate, 'day');
  
  if (diffInDays < 30) {
    return doneDate.fromNow();
  } else {
    return doneDate.format('MM/DD/YY');
  }
}
