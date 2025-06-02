'use client';

import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type React from 'react';

export default function BackButton() {
  return (
    <Button
      className="size-8"
      size="icon"
      title="Back"
      type="button"
      variant="ghost"
      onClick={() => window.history.back()}
    >
      <ChevronLeft className="h-5 w-5" />
      <span className="sr-only">Back</span>
    </Button>
  )
}
