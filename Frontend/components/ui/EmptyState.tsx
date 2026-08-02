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
    <div className="bg-aura-surface border border-aura-line rounded-xl p-12 text-center max-w-lg mx-auto my-12 space-y-4 shadow-xl transition-colors">
      <div className="w-16 h-16 rounded-full bg-aura-elevated border border-aura-line flex items-center justify-center mx-auto text-aura-gold transition-colors">
        <span className="font-serif text-2xl font-bold">A</span>
      </div>

      <h3 className="font-serif text-2xl text-aura-ink font-semibold transition-colors">{title}</h3>
      <p className="text-sm text-aura-subink leading-relaxed transition-colors">{description}</p>

      {actionHref && (
        <div className="pt-2">
          <Link
            href={actionHref}
            className="inline-block bg-aura-gold text-[#0A0A0C] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-aura-gold-soft transition-colors shadow-sm"
          >
            {actionText}
          </Link>
        </div>
      )}
    </div>
  );
}
