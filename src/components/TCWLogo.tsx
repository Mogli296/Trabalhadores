import React from 'react';

interface TCWLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function TCWLogo({ className = '', showText = true, size = 'md' }: TCWLogoProps) {
  // Handle dimensions based on size selection
  const iconSize = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }[size];

  const titleSize = {
    sm: 'text-xl tracking-tight',
    md: 'text-2xl tracking-tight',
    lg: 'text-3xl tracking-tight'
  }[size];

  const subtitleSize = {
    sm: 'text-[7px]',
    md: 'text-[8px]',
    lg: 'text-[9px]'
  }[size];

  return (
    <div id="tcw-logo-root" className={`flex items-center gap-3 select-none ${className}`}>
      {/* Golden Interconnected Globe + Sweeping Arrow Emblem */}
      <svg
        className={`${iconSize} shrink-0`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Real Metallic Gold Gradient */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2CC" />
            <stop offset="20%" stopColor="#ECC45C" />
            <stop offset="50%" stopColor="#C59B27" />
            <stop offset="80%" stopColor="#9C7310" />
            <stop offset="100%" stopColor="#755102" />
          </linearGradient>

          {/* Core Globe Interior Dark Metallic Radial Gradient */}
          <radialGradient id="globeBg" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="#252528" />
            <stop offset="70%" stopColor="#121214" />
            <stop offset="100%" stopColor="#0B0B0C" />
          </radialGradient>

          {/* Soft Glow filter */}
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer orbital gold ring background glow */}
        <circle cx="50" cy="50" r="38" stroke="url(#goldGrad)" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="3 3" />

        {/* 1. Main Globe sphere base */}
        <circle cx="50" cy="50" r="34" fill="url(#globeBg)" stroke="#1F1F22" strokeWidth="1" />

        {/* Abstract Golden Continents (representing geographic mapping) */}
        {/* Americas / Western hemisphere continent paths */}
        <path
          d="M32 30c2 1 2 5-1 7s-6-1-7 2c0 1 3 4 5 3s4-2 6-1 2 6-1 8c-3 2-6 8-4 10s5 4 4 7c-1 2-3 4-2 5l1 1c2-1 3-5 5-6s4-1 6-4 1-5 2-8 3-7 5-8c3-1 4-5 2-7c-2-2-4 1-6-1s-3-5-6-5s-4-1-7-2z"
          fill="url(#goldGrad)"
          fillOpacity="0.15"
        />
        {/* Europe / Africa / Middle East continent paths */}
        <path
          d="M62 25c1 2-2 3-1 6s4 2 2 4s-4 4-2 6c1 1 3 0 4 2s2 5 4 4s2-2 3-1s1 3 3 2c1 0 1-3 3-3s3 2 4 1c1-1 0-3-2-4s-3-1-2-3s2-2 1-4c0-2-3-2-4-4s-1-4-3-4s-4 1-6 2s-3-1-4 1s-1 1-3 1z"
          fill="url(#goldGrad)"
          fillOpacity="0.15"
        />
        <path
          d="M60 45c2 1 4 0 5 2s-1 6 1 8c2 3 4-1 5 1s-1 4-1 6c1 3 4-1 5 1s0 5-2 6s-4-1-6 2c-1 2-2-1-3-2s-4-1-5-3s2-4 0-5s-3-2-2-4s2-3 2-5s1-5-1-7z"
          fill="url(#goldGrad)"
          fillOpacity="0.1"
        />

        {/* 2. Global interconnectivity network grids (latitude and longitude arcs) */}
        <path d="M19 50 A 31 31 0 0 0 81 50" stroke="url(#goldGrad)" strokeWidth="0.75" strokeOpacity="0.35" fill="none" />
        <path d="M16 50 Q 50 72 84 50" stroke="url(#goldGrad)" strokeWidth="0.5" strokeOpacity="0.25" fill="none" />
        <path d="M16 50 Q 50 28 84 50" stroke="url(#goldGrad)" strokeWidth="0.5" strokeOpacity="0.25" fill="none" />
        
        <path d="M50 16 Q 32 50 50 84" stroke="url(#goldGrad)" strokeWidth="0.5" strokeOpacity="0.25" fill="none" />
        <path d="M50 16 Q 68 50 50 84" stroke="url(#goldGrad)" strokeWidth="0.5" strokeOpacity="0.25" fill="none" fillRule="evenodd" />

        {/* Connection Network Lines (explicit nodes mapping) */}
        <path d="M28 35 C 38 42, 52 42, 60 30" stroke="url(#goldGrad)" strokeWidth="0.75" strokeOpacity="0.6" strokeDasharray="1.5 1.5" fill="none" />
        <path d="M30 65 C 42 63, 44 48, 55 42" stroke="url(#goldGrad)" strokeWidth="0.75" strokeOpacity="0.6" strokeDasharray="1.5 1.5" fill="none" />
        <path d="M55 42 C 68 45, 78 52, 80 50" stroke="url(#goldGrad)" strokeWidth="0.75" strokeOpacity="0.5" fill="none" />
        <path d="M42 74 C 55 70, 71 61, 74 48" stroke="url(#goldGrad)" strokeWidth="0.75" strokeOpacity="0.5" fill="none" />

        {/* 3. High-tech user nodes (person silhouettes inside circular badges) */}
        {/* Node 1 (Top Left) */}
        <g transform="translate(28, 35)">
          <circle cx="0" cy="0" r="3.5" fill="#121214" stroke="url(#goldGrad)" strokeWidth="0.75" />
          <circle cx="0" cy="-0.5" r="1.2" fill="url(#goldGrad)" />
          <path d="M-1.8 2.2 C-1.8 1.1, -1 0.7, 0 0.7 C1 0.7, 1.8 1.1, 1.8 2.2 Z" fill="url(#goldGrad)" />
        </g>

        {/* Node 2 (Center) */}
        <g transform="translate(55, 42)">
          <circle cx="0" cy="0" r="3.5" fill="#121214" stroke="url(#goldGrad)" strokeWidth="0.75" />
          <circle cx="0" cy="-0.5" r="1.2" fill="url(#goldGrad)" />
          <path d="M-1.8 2.2 C-1.8 1.1, -1 0.7, 0 0.7 C1 0.7, 1.8 1.1, 1.8 2.2 Z" fill="url(#goldGrad)" />
        </g>

        {/* Node 3 (Bottom Mid) */}
        <g transform="translate(42, 74)">
          <circle cx="0" cy="0" r="3.5" fill="#121214" stroke="url(#goldGrad)" strokeWidth="0.75" />
          <circle cx="0" cy="-0.5" r="1.2" fill="url(#goldGrad)" />
          <path d="M-1.8 2.2 C-1.8 1.1, -1 0.7, 0 0.7 C1 0.7, 1.8 1.1, 1.8 2.2 Z" fill="url(#goldGrad)" />
        </g>

        {/* Node 4 (Right Lower) */}
        <g transform="translate(74, 48)">
          <circle cx="0" cy="0" r="3.5" fill="#121214" stroke="url(#goldGrad)" strokeWidth="0.75" />
          <circle cx="0" cy="-0.5" r="1.2" fill="url(#goldGrad)" />
          <path d="M-1.8 2.2 C-1.8 1.1, -1 0.7, 0 0.7 C1 0.7, 1.8 1.1, 1.8 2.2 Z" fill="url(#goldGrad)" />
        </g>

        {/* Node 5 (Top Right) */}
        <g transform="translate(68, 28)">
          <circle cx="0" cy="0" r="2.5" fill="#121214" stroke="url(#goldGrad)" strokeWidth="0.5" />
          <circle cx="0" cy="-0.3" r="0.8" fill="url(#goldGrad)" />
          <path d="M-1.2 1.5 C-1.2 0.8, -0.6 0.5, 0 0.5 C0.6 0.5, 1.2 0.8, 1.2 1.5 Z" fill="url(#goldGrad)" />
        </g>

        {/* Node 6 (Left Lower) */}
        <g transform="translate(18, 62)">
          <circle cx="0" cy="0" r="2.5" fill="#121214" stroke="url(#goldGrad)" strokeWidth="0.5" />
          <circle cx="0" cy="-0.3" r="0.8" fill="url(#goldGrad)" />
          <path d="M-1.2 1.5 C-1.2 0.8, -0.6 0.5, 0 0.5 C0.6 0.5, 1.2 0.8, 1.2 1.5 Z" fill="url(#goldGrad)" />
        </g>

        {/* 4. The Sweeping Orbital Golden Arrow */}
        {/* Dynamic bezier sweeping line with variable thickness representing orbiting velocity */}
        <path
          d="M 12 50 C 11 75, 45 92, 75 70 C 85 61, 91 48, 92 38"
          stroke="url(#goldGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          filter="url(#goldGlow)"
        />
        <path
          d="M 12 50 C 11 75, 45 92, 75 70 C 85 61, 91 48, 92 38"
          stroke="#FFFFFF"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* Sweeping arrow tip (pointing forward and upward on the right side) */}
        <g transform="translate(92.2, 37) rotate(-35)">
          <path
            d="M -5 3 L 1 -5 L 6 3 L 1 1 Z"
            fill="url(#goldGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="0.5"
            filter="url(#goldGlow)"
          />
          <path
            d="M -5 3 L 1 -5 L 6 3 L 1 1 Z"
            fill="#FFFFFF"
            fillOpacity="0.3"
          />
        </g>
      </svg>

      {/* Styled Brand Text "TCW" + "CONNECTING THE FUTURE" */}
      {showText && (
        <div className="flex flex-col text-left justify-center">
          <div className="flex items-baseline leading-none">
            {/* T (Silver/White gradient) */}
            <span className={`${titleSize} font-sans font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400`}>
              T
            </span>
            {/* C (Rich Gold/Bronze gradient) */}
            <span className={`${titleSize} font-sans font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0C2] via-[#DDA934] to-[#997116] mx-[1px]`}>
              C
            </span>
            {/* W (Silver/White gradient) */}
            <span className={`${titleSize} font-sans font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400`}>
              W
            </span>
          </div>
          {/* Subtitle "CONNECTING THE FUTURE." */}
          <span className={`${subtitleSize} font-mono font-black tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-[#ECC45C] via-[#C59B27] to-[#DDA934] uppercase mt-1 whitespace-nowrap`}>
            CONNECTING THE FUTURE
          </span>
        </div>
      )}
    </div>
  );
}
