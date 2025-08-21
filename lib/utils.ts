import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RewardShipMethod } from '@intuipay/shared/constants';
import { REWARD_SHIP_METHOD_LABELS } from '@/data';
import slugify from 'slugify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export const toS3ImageName = (name: string): string => {
  // 分离文件名和扩展名
  const lastDotIndex = name.lastIndexOf('.');
  const fileName = lastDotIndex > 0 ? name.substring(0, lastDotIndex) : name;
  const fileExtension = lastDotIndex > 0 ? name.substring(lastDotIndex) : '';

  // 只对文件名部分进行 slugify 处理，保留原始扩展名
  const slugifiedFileName = slugify(fileName, {
    lower: true,
    strict: true,
    trim: true,
  });

  const slugifiedName = slugifiedFileName + fileExtension;
  return slugifiedName;
};
