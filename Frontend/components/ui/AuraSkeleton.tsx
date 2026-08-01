export function AuraSkeletonCard() {
  return (
    <div className="bg-[#151517] border border-[#D4A02A]/10 rounded-lg overflow-hidden animate-pulse">
      <div className="w-full aspect-[3/4] bg-[#1D1D20]" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-[#1D1D20] rounded w-3/4" />
        <div className="h-3 bg-[#1D1D20] rounded w-1/2" />
        <div className="h-3 bg-[#1D1D20] rounded w-1/3" />
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
