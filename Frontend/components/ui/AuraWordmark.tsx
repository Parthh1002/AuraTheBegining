import AuraLogoMark from './AuraLogoMark';

type WordmarkSize   = 'small' | 'medium' | 'large';
type WordmarkLayout = 'vertical' | 'horizontal';

export default function AuraWordmark({
  size        = 'small',
  layout      = 'vertical',
  className   = '',
  markVariant = 'auto',
}: {
  size?:        WordmarkSize;
  layout?:      WordmarkLayout;
  className?:   string;
  markVariant?: 'light' | 'dark' | 'auto';
}) {
  const isLarge      = size === 'large';
  const isMedium     = size === 'medium';
  const isHorizontal = layout === 'horizontal';

  return (
    <div
      className={`flex ${
        isHorizontal
          ? 'flex-row items-center gap-3'
          : 'flex-col items-center justify-center text-center'
      } ${className}`}
    >
      {/* ── Mark ── */}
      <AuraLogoMark
        className={
          isLarge
            ? 'w-20 h-20 sm:w-28 sm:h-28 mb-4'
            : isMedium
            ? (isHorizontal ? 'w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0' : 'w-11 h-11 sm:w-12 sm:h-12 mb-1.5')
            : (isHorizontal ? 'w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0' : 'w-9 h-9 sm:w-10 sm:h-10 mb-1')
        }
        variant={markVariant}
      />

      {/* ── Text lockup ── */}
      <div
        className={`flex flex-col ${
          isHorizontal ? 'items-start leading-none gap-0.5' : 'items-center justify-center'
        }`}
      >
        {/* AURA wordmark */}
        <span
          className={`font-serif font-bold uppercase ${
            isLarge
              ? 'text-5xl sm:text-7xl md:text-8xl tracking-[0.22em] text-aura-ink'
              : isMedium
              ? 'text-[22px] sm:text-[26px] tracking-[0.22em] text-aura-ink group-hover:text-aura-gold transition-colors duration-200'
              : 'text-[18px] sm:text-[20px] tracking-[0.22em] text-aura-ink group-hover:text-aura-gold transition-colors duration-200'
          }`}
        >
          AURA
        </span>

        {/* THE BEGINNING tagline */}
        <span
          className={`font-sans font-semibold uppercase ${
            isLarge
              ? 'text-[11px] sm:text-sm tracking-[0.4em] text-aura-gold mt-2'
              : isMedium
              ? 'text-[8px] sm:text-[9.5px] tracking-[0.3em] text-aura-gold mt-0.5'
              : 'text-[7.5px] tracking-[0.28em] text-aura-gold'
          }`}
          style={{ color: 'var(--aura-gold-on-surface, #B8891E)' }}
        >
          THE BEGINNING
        </span>
      </div>
    </div>
  );
}
