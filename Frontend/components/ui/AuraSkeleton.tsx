export function AuraSkeletonCard() {
  return (
    <div className="bg-aura-surface border border-aura-line rounded-xl overflow-hidden animate-pulse shadow-sm">
      <div className="w-full aspect-[3/4] bg-aura-elevated" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-aura-elevated rounded w-3/4 border border-aura-line/50" />
        <div className="h-3 bg-aura-elevated rounded w-1/2 border border-aura-line/50" />
        <div className="h-3 bg-aura-elevated rounded w-1/3 border border-aura-line/50" />
      </div>
    </div>
  );
}

export function AuraSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <AuraSkeletonCard key={i} />
      ))}
    </div>
  );
}
