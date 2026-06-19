interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading flights..." }: LoadingStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-16"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600"
        aria-hidden="true"
      />
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  );
}
