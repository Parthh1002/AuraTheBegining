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
          className={`font-serif font-bold uppercase whitespace-nowrap ${
            isLarge
              ? 'text-2xl sm:text-4xl md:text-5xl tracking-[0.05em] text-aura-ink'
              : isMedium
              ? 'text-[13px] sm:text-[15px] md:text-[17px] tracking-[0.05em] text-aura-ink group-hover:text-aura-gold transition-colors duration-200'
              : 'text-[10px] sm:text-[12px] md:text-[14px] tracking-[0.05em] text-aura-ink group-hover:text-aura-gold transition-colors duration-200'
          }`}
        >AKSHAY KHANNA'S</span>

        {/* THE BEGINNING tagline */}
        <span
          className={`font-sans font-semibold uppercase whitespace-nowrap ${
            isLarge
              ? 'text-[8px] sm:text-[10px] tracking-[0.1em] text-aura-gold mt-1'
              : isMedium
              ? 'text-[6px] sm:text-[7px] tracking-[0.1em] text-aura-gold mt-0.5'
              : 'text-[4.5px] sm:text-[5px] md:text-[6px] tracking-[0.1em] text-aura-gold'
          }`}
          style={{ color: 'var(--aura-gold-on-surface, #B8891E)' }}
        >STORE FOR ONLY MEN'S</span>
      </div>
    </div>
  );
}
