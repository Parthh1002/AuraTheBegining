import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}

export default function EmptyState({
  title = 'No Items Found',
  description = 'There are currently no items matching your selection.',
  actionText = 'Browse All Collections',
  actionHref = '/collections',
}: EmptyStateProps) {
  return (
    <div className="bg-[#151517] border border-[#D4A02A]/20 rounded-xl p-12 text-center max-w-lg mx-auto my-12 space-y-4 shadow-xl">
      <div className="w-16 h-16 rounded-full bg-[#1D1D20] border border-[#D4A02A]/30 flex items-center justify-center mx-auto text-[#D4A02A]">
        <span className="font-serif text-2xl font-bold">A</span>
      </div>

      <h3 className="font-serif text-2xl text-[#F5F1E8] font-semibold">{title}</h3>
      <p className="text-sm text-[#9C9894] leading-relaxed">{description}</p>

      {actionHref && (
        <div className="pt-2">
          <Link
            href={actionHref}
            className="inline-block bg-[#D4A02A] text-[#0A0A0C] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-[#E8C168] transition-colors"
          >
            {actionText}
          </Link>
        </div>
      )}
    </div>
  );
}
