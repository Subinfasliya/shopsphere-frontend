const Loader = ({ label = 'Loading...' }) => (
  <div className="flex min-h-40 items-center justify-center gap-3 text-slate-600">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
    <span>{label}</span>
  </div>
);

export default Loader;
