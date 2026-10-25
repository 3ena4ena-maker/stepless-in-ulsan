import React from 'react';

interface UlsanIllustrationProps {
  type: 'whale-hero' | 'whale-sea' | 'bamboo-garden' | 'bridge-night' | 'heritage';
  className?: string;
}

export default function UlsanIllustration({ type, className = '' }: UlsanIllustrationProps) {
  switch (type) {
    case 'whale-hero':
      return (
        <svg
          viewBox="0 0 180 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Warm Sunrise Halo (Ganjeolgot First Sunrise & Luminous Industrial Energy) */}
          <circle cx="132" cy="28" r="18" fill="#FDF1EB" />
          <circle cx="132" cy="28" r="11" fill="#FAD8C5" opacity="0.75" />
          <circle cx="132" cy="28" r="5.5" fill="#E57A44" />

          {/* Subtle Ulsan Bridge Suspension Arch in Background (Bright Architectural Line) */}
          <path
            d="M16 74 L36 32 L52 74 M36 32 C68 58 112 58 148 34 L162 74"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 3"
          />

          {/* Water Spout Sparkles (Whale Breeze) */}
          <path
            d="M66 28 C66 19 59 13 50 13"
            stroke="#2484B8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M70 26 C71 16 79 11 88 12"
            stroke="#5BA8D0"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="46" cy="14" r="2" fill="#2484B8" />
          <circle cx="91" cy="13" r="2" fill="#8EA85E" />
          <circle cx="68" cy="10" r="2.2" fill="#E57A44" />

          {/* Graceful Ulsan Whale Body (Bright Aqua Fill + Crisp Editorial Line) */}
          <path
            d="M36 62 C36 42 54 31 78 33 C98 35 110 47 125 50 C134 52 142 47 147 39 C148 48 143 56 136 60 C143 62 149 67 151 73 C142 71 133 67 126 62 C110 68 85 70 58 69 C44 68 36 66 36 62 Z"
            fill="#E3F2FA"
            stroke="#1B6B96"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Whale Belly Striations (Editorial Detail) */}
          <path
            d="M44 63 C58 63 74 61 86 55"
            stroke="#2484B8"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M52 67 C66 66 80 64 92 59"
            stroke="#2484B8"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Gentle Smiling Eye */}
          <path
            d="M53 49 C54.8 46.8 57.5 46.8 59.2 49"
            stroke="#11161B"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="51" cy="53" r="2.5" fill="#F4A27E" opacity="0.65" />

          {/* Stepless Flat Boardwalk & Gentle East Sea Waves */}
          <path
            d="M14 75 C38 71 62 79 90 74 C118 69 142 78 166 73"
            stroke="#2484B8"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M26 83 H154"
            stroke="#8EA85E"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'whale-sea':
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className}>
          <path
            d="M8 29 C8 19 17 14 27 16 C34 17.5 38 22 42 18 C42 23 39 26 36 27.5 C39 29 41 31 42 34 C38 33 35 31 33 29 C26 32 16 32 8 29 Z"
            fill="#DCEFF9"
            stroke="#1B6B96"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="23" r="1.5" fill="#1B6B96" />
          <path d="M6 37 C14 34 22 39 30 36 C36 34 40 37 43 36" stroke="#2484B8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'bamboo-garden':
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className}>
          <path d="M16 40 V10 M13 22 H19 M13 30 H19" stroke="#4D7744" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M28 40 V8 M25 18 H31 M25 27 H31" stroke="#6B853E" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M16 15 C11 13 9 16 12 19 C14 20 16 18 16 15 Z" fill="#CBE3C4" stroke="#4D7744" strokeWidth="1.8" />
          <path d="M28 13 C33 10 36 13 33 17 C31 18 28 16 28 13 Z" fill="#CBE3C4" stroke="#4D7744" strokeWidth="1.8" />
          <path d="M28 23 C34 21 37 24 33 27 C31 28 28 26 28 23 Z" fill="#DCECD7" stroke="#6B853E" strokeWidth="1.8" />
          <path d="M8 40 H40" stroke="#4D7744" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'bridge-night':
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className}>
          <circle cx="35" cy="13" r="5" fill="#FAD8C5" stroke="#CC6230" strokeWidth="1.8" />
          <path d="M12 38 V16 M36 38 V16" stroke="#CC6230" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M6 31 H42" stroke="#CC6230" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M6 27 C10 24 12 18 12 16 C18 26 30 26 36 16 C36 18 38 24 42 27" stroke="#E57A44" strokeWidth="2" strokeLinecap="round" />
          <path d="M20 23 V31 M24 24 V31 M28 23 V31" stroke="#E57A44" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 38 H40" stroke="#F0B296" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'heritage':
    default:
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className}>
          <rect x="9" y="12" width="30" height="24" rx="6" fill="#EFE8F4" stroke="#6A487C" strokeWidth="2.2" />
          <path d="M16 24 C19 20 24 20 28 23 L32 20 V27 L28 24 C24 27 19 27 16 24 Z" stroke="#6A487C" strokeWidth="2" strokeLinejoin="round" />
          <path d="M14 31 H34" stroke="#9B7BB0" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
}
