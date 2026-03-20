export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-border-light border-t-primary rounded-full animate-spin" />
        <p className="text-xs text-tertiary">Yükleniyor...</p>
      </div>
    </div>
  );
}
