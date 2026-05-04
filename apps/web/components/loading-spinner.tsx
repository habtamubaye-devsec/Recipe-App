export default function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-6 py-16">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-orange-200 bg-white/80 px-8 py-10 shadow-sm">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
        <p className="text-sm font-medium text-orange-950/70">{message}</p>
      </div>
    </div>
  );
}
