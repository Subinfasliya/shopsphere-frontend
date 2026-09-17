const ErrorMessage = ({ message = 'Something went wrong', onRetry }) => (
  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
    <p className="font-medium">{message}</p>
    {onRetry && <button onClick={onRetry} className="mt-2 text-sm font-semibold underline">Try again</button>}
  </div>
);

export default ErrorMessage;
