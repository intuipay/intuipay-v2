'use client'

import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { Update } from '@/types'
import { useEffect, useState } from 'react'

type UpdatesTabProps = {
  projectId: number;
  onUpdate: (count: number) => void
}

const formatDateForUpdate = (dateString: string) => {
  const date = new Date(dateString)
  const day = date.toLocaleDateString('en-US', { day: '2-digit' })
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const year = date.toLocaleDateString('en-US', { year: 'numeric' })
  return { day, month, year }
}

export function UpdatesTab({ projectId, onUpdate }: UpdatesTabProps) {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  async function fetchUpdates() {
    if (isLoading) return;

    setIsLoading(true);
    const searchParams = new URLSearchParams();
    searchParams.set('start', ((page - 1) * 20).toString());
    searchParams.set('pagesize', '20');
    const response = await fetch(`/api/project/${projectId}/updates?${searchParams.toString()}`);
    const { data } = (await response.json()) as { data: Update[] };
    setUpdates(data);
    setIsLoaded(true);
    setIsLoading(false);
  };
  async function fetchUpdatesCount() {
    const response = await fetch(`/api/project/${projectId}/updates-count`);
    const { data } = (await response.json()) as { data: number };
    setTotal(data);
    onUpdate(data);
  }

  useEffect(() => {
    fetchUpdates();
  }, [page]);
  useEffect(() => {
    fetchUpdatesCount();
  }, []);

  if (isLoaded && updates.length === 0) {
    return <p className="text-center text-gray-500 py-4">No updates yet for this project.</p>
  }

  if (isLoading) {
    return <p className="text-center text-gray-500 py-4">Loading...</p>
  }

  return (
    <div className="space-y-8">
      {updates.map((update, index) => {
        const { day, month, year } = formatDateForUpdate(update.created_at)
        return (
          <div key={update.id} className="relative pl-10 sm:pl-12 md:pl-16">
            <div className="absolute left-0 top-1 text-center w-10 md:w-12">
              <p className="text-lg md:text-xl font-semibold text-neutral-text">{day}</p>
              <p className="text-xs md:text-sm text-neutral-darkgray">{month}</p>
              <p className="text-xs text-neutral-darkgray">{year}</p>
            </div>
            {index < updates.length && (
              <div className="absolute left-5 md:left-6 top-2 bottom-0 w-0.5 bg-neutral-mediumgray/50"></div>
            )}
            <div className="absolute left-[18px] md:left-[22px] top-[6px] w-2.5 h-2.5 rounded-full bg-action-blue border-2 border-neutral-white dark:border-neutral-black"></div>
            <div className="ml-4">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-neutral-text">{update.title}</h3>
              <p className="text-neutral-darkgray leading-relaxed mb-4">{update.content}</p>
              {update.media && (
                <div className="bg-intuipay-lighterblue/30 aspect-video rounded-md p-4 mb-4 flex items-center justify-center">
                  {update.media.type === 'placeholder' ? (
                    <p className="text-center text-neutral-darkgray">Media</p>
                  ) : (
                    <Image
                      src={update.media.url || '/placeholder.svg'}
                      alt={update.media.alt || update.title}
                      width={600}
                      height={400}
                      className="rounded-md object-contain max-h-[400px]"
                    />
                  )}
                </div>
              )}
            </div>
            {index < updates.length - 1 && <Separator className="mt-8" />}
          </div>
        )
      })}
    </div>
  )
}
