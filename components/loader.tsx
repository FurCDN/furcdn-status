import clsx from 'clsx';

/**
 * Arc spinner copied from Cloudflare's new status page (Kumo "Loader"):
 * two concentric r=9.5 circles, the track at 10% opacity, the arc growing
 * from 0 to 42 units while it rotates. Their build drives it with SMIL;
 * this uses the same numbers as CSS keyframes so reduced motion can opt out.
 */
interface LoaderProps {
  size?: number;
  className?: string;
  label?: string;
}

export function Loader({ size = 16, className, label }: LoaderProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      role="status"
      aria-label={label}
      className={clsx('loader-spin', className)}
    >
      <circle cx="12" cy="12" r="9.5" strokeWidth="2" strokeLinecap="round" opacity="0.1" />
      <circle
        cx="12"
        cy="12"
        r="9.5"
        strokeWidth="2"
        strokeLinecap="round"
        className="loader-arc"
      />
    </svg>
  );
}
