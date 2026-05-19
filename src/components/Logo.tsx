export default function Logo({ className = '', iconSize = 32, showText = true }: { className?: string; iconSize?: number; showText?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Circle background */}
        <circle cx="20" cy="20" r="20" fill="url(#grad)" />
        {/* Heart shape */}
        <path
          d="M20 29s-9-5.5-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-9 12-9 12z"
          fill="white"
          opacity="0.95"
        />
        {/* Small cross / plus on heart */}
        <rect x="18.5" y="17" width="3" height="7" rx="1" fill="url(#grad)" />
        <rect x="16" y="19.5" width="8" height="3" rx="1" fill="url(#grad)" />
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent leading-none">
          Meri Hope
        </span>
      )}
    </div>
  );
}
