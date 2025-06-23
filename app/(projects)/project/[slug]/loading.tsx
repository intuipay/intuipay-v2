import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonPage() {
  return (
    <div className="container">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 mx-auto">
          <Skeleton className="h-12 w-3/4 mx-auto" />
        </h1>
        <div className="text-black text-md sm:text-lg md:text-xl text-neutral-darkgray">
          <Skeleton className="h-7 w-4/5 mx-auto" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="lg:w-2/3">
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6 shadow-lg">
            <Skeleton className="w-full h-full" />
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-neutral-darkgray mb-6">
            <div className="flex items-center gap-2">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>

        {/* Right Column (Sticky Sidebar) */}
        <div className="lg:w-1/3 lg:sticky lg:top-24 self-start">
          <div className="border border-neutral-mediumgray/50 rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold mb-2">
                <Skeleton className="h-9 w-1/2" />
              </div>
              <div className="text-sm text-neutral-darkgray mb-2">
                <Skeleton className="h-5 w-3/4" />
              </div>
              <Skeleton className="h-1.5 w-full" />
            </div>
            <div className="flex text-center">
              <div className="flex-1 text-left">
                <div className="text-xl sm:text-2xl font-semibold">
                  <Skeleton className="h-8 w-1/2" />
                </div>
                <div className="text-xs text-neutral-darkgray">
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
              <div className="flex-1 text-left">
                <div className="text-xl sm:text-2xl font-semibold">
                  <Skeleton className="h-8 w-1/3" />
                </div>
                <div className="text-xs text-neutral-darkgray">
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm grid grid-cols-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-3/4" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="lg:w-2/3">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="pt-4 px-6">
          <ul className="space-y-2">
            <li>
              <Skeleton className="h-5 w-24" />
            </li>
            <li>
              <Skeleton className="h-5 w-32" />
            </li>
            <li>
              <Skeleton className="h-5 w-20" />
            </li>
          </ul>
        </div>
      </div>

      <section className="mt-16 pt-12 border-t border-neutral-mediumgray/50">
        <div className="flex justify-between items-center mb-8">
          <div className="text-xl sm:text-2xl md:text-3xl">
            <Skeleton className="h-9 w-40" />
          </div>
          <Skeleton className="h-12 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
        </div>
      </section>
    </div>
  );
}
