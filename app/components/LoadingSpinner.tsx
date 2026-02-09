'use client';

export default function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-gray-300 border-t-black ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <LoadingSpinner className="h-10 w-10 border-2 border-t-black" />
    </div>
  );
}
