export function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 animate-pulse"
        >
          <div className="flex items-center gap-4">
            {/* Profile Image Skeleton */}
            <div className="w-14 h-14 bg-slate-700/50 rounded-full"></div>

            {/* User Info Skeleton */}
            <div className="flex-1">
              <div className="h-5 bg-slate-700/50 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-slate-700/30 rounded w-1/4"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="hidden md:flex items-center gap-6 mr-4">
              <div className="text-center">
                <div className="h-5 bg-slate-700/50 rounded w-12 mb-1"></div>
                <div className="h-3 bg-slate-700/30 rounded w-16"></div>
              </div>
              <div className="text-center">
                <div className="h-5 bg-slate-700/50 rounded w-12 mb-1"></div>
                <div className="h-3 bg-slate-700/30 rounded w-16"></div>
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="h-10 w-24 bg-slate-700/50 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
