const SkeletonBlock = ({ className = '' }) => <span className={`block animate-pulse rounded-xl bg-slate-200 ${className}`} />;

const Loader = ({ label = 'Loading...' }) => (
  <div className="space-y-6 py-4" role="status" aria-label={label}>
    <div className="flex items-center justify-between"><SkeletonBlock className="h-8 w-48" /><SkeletonBlock className="h-10 w-28" /></div>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><SkeletonBlock className="h-48 rounded-none" /><div className="space-y-3 p-4"><SkeletonBlock className="h-5 w-3/4" /><SkeletonBlock className="h-4 w-1/2" /><SkeletonBlock className="h-10 w-full" /></div></div>)}
    </div>
    <span className="sr-only">{label}</span>
  </div>
);

export default Loader;
