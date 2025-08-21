'use client';

import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type React from 'react';
import { clsx } from 'clsx';

type Props = {
  className?: string;
}
export default function BackButton({
  className = '',
}: Props) {
  return (
    <Button
      className={clsx('size-8', className)}
      size="icon"
      title="Back"
      type="button"
      variant="ghost"
      onClick={() => window.history.back()}
    >
      <ChevronLeft className="h-5 w-5" />
      <span className="sr-only">Back</span>
    </Button>
  );
}
