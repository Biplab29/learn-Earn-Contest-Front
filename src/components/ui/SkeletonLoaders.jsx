/**
 * Reusable Skeleton Loading Components
 * Used across UsersPage, ContestManagementPage, etc.
 * to show a polished loading state instead of plain "Loading..."
 */

/** Base shimmer block — use width/height/rounded via className */
export const SkeletonBlock = ({ className = "" }) => (
  <div className={`skeleton-shimmer rounded-xl ${className}`} />
);

/** ─── Users Page Skeleton ─── */
export const UsersTableSkeleton = ({ rows = 6 }) => (
  <div className="theme-surface rounded-2xl overflow-hidden">
    {/* header row */}
    <div className="hidden md:grid grid-cols-5 px-4 py-3 border-b theme-border gap-3">
      {["User", "Email", "Role", "Date", "Actions"].map((col) => (
        <SkeletonBlock key={col} className="h-4 w-20" />
      ))}
    </div>

    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="border-b theme-border px-4 py-4"
      >
        {/* mobile */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-9 w-9 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-3.5 w-32" />
              <SkeletonBlock className="h-3 w-44" />
            </div>
          </div>
          <div className="flex justify-between">
            <SkeletonBlock className="h-3 w-16" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
          <div className="flex gap-2">
            <SkeletonBlock className="h-8 flex-1 rounded-lg" />
            <SkeletonBlock className="h-8 flex-1 rounded-lg" />
          </div>
        </div>

        {/* desktop */}
        <div className="hidden md:grid grid-cols-5 items-center gap-3">
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-8 w-8 rounded-full flex-shrink-0" />
            <SkeletonBlock className="h-3.5 w-24" />
          </div>
          <SkeletonBlock className="h-3.5 w-36" />
          <SkeletonBlock className="h-3.5 w-14" />
          <SkeletonBlock className="h-3.5 w-20" />
          <div className="flex justify-end gap-2">
            <SkeletonBlock className="h-7 w-14 rounded-lg" />
            <SkeletonBlock className="h-7 w-16 rounded-lg" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/** ─── Contest Card Skeleton ─── */
export const ContestCardSkeleton = () => (
  <div className="theme-surface overflow-hidden rounded-[28px] shadow-sm">
    <div className="grid gap-0 md:grid-cols-[220px_1fr]">
      {/* image placeholder */}
      <SkeletonBlock className="min-h-[200px] w-full rounded-none" />

      {/* content */}
      <div className="p-5 sm:p-6 flex flex-col gap-4">
        <div className="space-y-2">
          <SkeletonBlock className="h-5 w-3/4" />
          <SkeletonBlock className="h-3.5 w-full" />
          <SkeletonBlock className="h-3.5 w-5/6" />
        </div>

        {/* info grid */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[70px] rounded-2xl p-3 space-y-2 bg-white/60 border theme-border">
              <SkeletonBlock className="h-2.5 w-16" />
              <SkeletonBlock className="h-4 w-20" />
            </div>
          ))}
        </div>

        {/* footer badges */}
        <div className="flex gap-2 flex-wrap mt-2">
          <SkeletonBlock className="h-7 w-28 rounded-full" />
          <SkeletonBlock className="h-7 w-24 rounded-full" />
          <SkeletonBlock className="h-7 w-32 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

/** ─── Contest Management Skeleton Grid ─── */
export const ContestGridSkeleton = ({ count = 4 }) => (
  <div className="grid gap-5 xl:grid-cols-2 items-stretch">
    {Array.from({ length: count }).map((_, i) => (
      <ContestCardSkeleton key={i} />
    ))}
  </div>
);
