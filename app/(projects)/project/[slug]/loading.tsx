// SkeletonScreen.tsx
import React from 'react';
import './Skeleton.css'; // 假设您有一个CSS文件来定义样式

// 导出一个名为Skeleton的函数组件
export default function Skeleton() {
  return (
    <div className="container">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          <div className="skeleton-line" style={{ width: '75%' }} />
        </h1>
        <p className="text-black text-md sm:text-lg md:text-xl text-neutral-darkgray">
          <div className="skeleton-line" style={{ width: '80%' }} />
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="lg:w-2/3">
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6 shadow-lg">
            <div className="skeleton-image" />
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-neutral-darkgray mb-6">
            <span className="flex items-center">
              <div className="skeleton-circle" style={{ width: '8px', height: '8px' }} />
              <div className="skeleton-line" style={{ width: '50%' }} />
            </span>
            <span className="flex items-center">
              <div className="skeleton-circle" style={{ width: '8px', height: '8px' }} />
              <div className="skeleton-line" style={{ width: '50%' }} />
            </span>
            <span className="flex items-center">
              <div className="skeleton-circle" style={{ width: '8px', height: '8px' }} />
              <div className="skeleton-line" style={{ width: '50%' }} />
            </span>
            <span className="flex items-center">
              <div className="skeleton-circle" style={{ width: '8px', height: '8px' }} />
              <div className="skeleton-line" style={{ width: '50%' }} />
            </span>
          </div>
        </div>

        {/* Right Column (Sticky Sidebar) */}
        <div className="lg:w-1/3 lg:sticky lg:top-24 self-start">
          <div className="border border-neutral-mediumgray/50 rounded-lg p-6 space-y-6">
            <div className="flex items-center">
              <div className="skeleton-circle" style={{ width: '20px', height: '20px' }} />
              <div className="skeleton-line" style={{ width: '50%' }} />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold mb-2">
                <div className="skeleton-line" style={{ width: '50%' }} />
              </p>
              <p className="text-sm text-neutral-darkgray mb-2">
                <div className="skeleton-line" style={{ width: '75%' }} />
              </p>
              <div className="skeleton-line" style={{ width: '100%', height: '5px' }} />
            </div>
            <div className="flex text-center">
              <div className="flex-1 text-left">
                <p className="text-xl sm:text-2xl font-semibold">
                  <div className="skeleton-line" style={{ width: '50%' }} />
                </p>
                <p className="text-xs text-neutral-darkgray">
                  <div className="skeleton-line" style={{ width: '30%' }} />
                </p>
              </div>
              <div className="flex-1 text-left">
                <p className="text-xl sm:text-2xl font-semibold">
                  <div className="skeleton-line" style={{ width: '30%' }} />
                </p>
                <p className="text-xs text-neutral-darkgray">
                  <div className="skeleton-line" style={{ width: '50%' }} />
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm grid grid-cols-2">
              <div className="skeleton-line" style={{ width: '75%' }} />
              <div className="skeleton-line" style={{ width: '75%' }} />
              <div className="skeleton-line" style={{ width: '75%' }} />
              <div className="skeleton-line" style={{ width: '75%' }} />
            </div>
            <div className="skeleton-button w-full" />
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="skeleton-tabs lg:w-2/3" />
        <div className="pt-4 px-6">
          <ul className="space-y-2">
            <li>
              <div className="skeleton-line" style={{ width: '50%' }} />
            </li>
            <li>
              <div className="skeleton-line" style={{ width: '60%' }} />
            </li>
            <li>
              <div className="skeleton-line" style={{ width: '40%' }} />
            </li>
          </ul>
        </div>
      </div>

      <section className="mt-16 pt-12 border-t border-neutral-mediumgray/50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl">
            <div className="skeleton-line" style={{ width: '50%' }} />
          </h2>
          <div className="skeleton-button" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </section>
    </div>
  );
}
