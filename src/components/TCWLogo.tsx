import React from 'react';

interface TCWLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
}

export default function TCWLogo({ className = '', showText = true, size = 'md', layout = 'horizontal' }: TCWLogoProps) {
  // Handle dimensions based on size selection
  const iconSize = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-44 h-44'
  }[size];

  const titleSize = {
    sm: 'text-base sm:text-lg tracking-[0.05em] font-black',
    md: 'text-2xl sm:text-3xl tracking-[0.05em] font-black',
    lg: 'text-5xl sm:text-6xl tracking-[0.05em] font-black'
  }[size];

  const subtitleSize = {
    sm: 'text-[6px] sm:text-[7px] tracking-[0.18em] font-bold',
    md: 'text-[8px] sm:text-[9.5px] tracking-[0.2em] font-black',
    lg: 'text-[12px] sm:text-[13px] tracking-[0.22em] font-black'
  }[size];

  return (
    <div 
      id="tcw-logo-root" 
      className={`select-none flex ${layout === 'vertical' ? 'flex-col items-center text-center gap-4' : 'items-center gap-2.5 sm:gap-3.5'} ${className}`}
    >
      {/* 3D Glass Globe, Interconnected networks, Team Nodes & Sweeping Blue Arrow */}
      <svg
        className={`${iconSize} shrink-0`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Royal Blue to Electric Blue Ribbon Gradient */}
          <linearGradient id="richBlueGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#005BFF" />
            <stop offset="30%" stopColor="#0084FF" />
            <stop offset="70%" stopColor="#00BFFF" />
            <stop offset="100%" stopColor="#00F5FF" />
          </linearGradient>

          {/* Electric Blue Glow */}
          <linearGradient id="neonBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0070FF" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>

          {/* Globe Background Light Sphere Gradient */}
          <radialGradient id="glassGlobeBg" cx="50%" cy="40%" r="55%" fx="35%" fy="25%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#F0F4FC" />
            <stop offset="85%" stopColor="#D9E4FA" />
            <stop offset="100%" stopColor="#C4D5F7" />
          </radialGradient>

          {/* Continent Shape Gradient (Soft grayish silver) */}
          <linearGradient id="continentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Soft Shadow Filter */}
          <filter id="vectorDropShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#003DDF" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* 1. Transparent shadow for the sweeping outer ring */}
        <circle cx="50" cy="50" r="38" stroke="url(#richBlueGrad)" strokeWidth="0.5" strokeOpacity="0.1" />

        {/* 2. Globe base with the premium blue-white glass radial gradient */}
        <circle cx="50" cy="50" r="33" fill="url(#glassGlobeBg)" stroke="#E2E8F0" strokeWidth="0.75" />

        {/* 3. Subtle continents outline (gray/silver tone to support layout color) */}
        {/* Americas Continent */}
        <path
          d="M28 32c1.5 0.5 1.5 4-0.8 5.3s-4.5-0.8-5.3 1.5c0 0.8 2.3 3 3.8 2.3s3-1.5 4.5-0.8 1.5 4.5-0.8 6c-2.3 1.5-4.5 6-3 7.5s3.8 3 3 5.3c-0.8 1.5-2.3 3-1.5 3.8l0.8 0.8c1.5-0.8 2.3-3.8 3.8-4.5s3-0.8 4.5-3 0.8-3.8 1.5-6 2.3-5.3 3.8-6c2.3-0.8 3-3.8 1.5-5.3c-1.5-1.5-3 0.8-4.5-0.8s-2.3-3.8-4.5-3.8s-3-0.8-5.3-1.5z"
          fill="url(#continentGrad)"
          fillOpacity="0.45"
        />
        {/* Europe / Africa Continent */}
        <path
          d="M62 26c1 1.5-1.5 2.3-0.8 4.5s3 1.5 1.5 3-3 3-1.5 4.5c0.8 0.8 2.3 0 3 1.5s1.5 3.8 3 3s1.5-1.5 2.3-0.8s0.8 2.3 2.3 1.5c0.8 0 0.8-2.3 2.3-2.3s2.3 1.5 3 0.8c0.8-0.8 0-2.3-1.5-3s-2.3-0.8-1.5-2.3s1.5-1.5 0.8-3c0-1.5-2.3-1.5-3-3s-0.8-3-2.3-3s-3 0.8-4.5 1.5s-2.3-0.8-3 0.8s-0.8 0.8-2.3 0.8z"
          fill="url(#continentGrad)"
          fillOpacity="0.45"
        />

        {/* 4. Elegant globe network arcs (Interconnectivity longitudes & latitudes with soft blue glow) */}
        <path d="M17 50 A 33 33 0 0 0 83 50" stroke="#00C4FF" strokeWidth="0.65" strokeOpacity="0.45" fill="none" />
        <path d="M17 50 Q 50 68 83 50" stroke="#00C4FF" strokeWidth="0.65" strokeOpacity="0.4" fill="none" />
        <path d="M17 50 Q 50 32 83 50" stroke="#00C4FF" strokeWidth="0.65" strokeOpacity="0.4" fill="none" />
        <path d="M50 17 Q 35 50 50 83" stroke="#00C4FF" strokeWidth="0.65" strokeOpacity="0.4" fill="none" />
        <path d="M50 17 Q 65 50 50 83" stroke="#00C4FF" strokeWidth="0.65" strokeOpacity="0.4" fill="none" />

        {/* Network connections (Dots on the intersections representing branches/agencies) */}
        <circle cx="35" cy="27" r="1.8" fill="#00E5FF" opacity="1.0" />
        <circle cx="50" cy="26" r="2.2" fill="#00E5FF" opacity="1.0" />
        <circle cx="63" cy="23" r="1.8" fill="#00E5FF" opacity="1.0" />
        <circle cx="39" cy="37" r="1.8" fill="#00E5FF" opacity="1.0" />
        <circle cx="61" cy="36" r="1.8" fill="#00E5FF" opacity="1.0" />
        <circle cx="31" cy="43" r="1.8" fill="#00E5FF" opacity="1.0" />

        {/* Light connection paths connecting the dot network */}
        <path d="M35 27 Q 44 24 50 26" stroke="#00E5FF" strokeWidth="0.6" strokeOpacity="0.75" fill="none" />
        <path d="M50 26 Q 57 23 63 23" stroke="#00E5FF" strokeWidth="0.6" strokeOpacity="0.75" fill="none" />
        <path d="M35 27 Q 37 32 39 37" stroke="#00E5FF" strokeWidth="0.6" strokeOpacity="0.75" fill="none" />
        <path d="M50 26 Q 56 31 61 36" stroke="#00E5FF" strokeWidth="0.6" strokeOpacity="0.75" fill="none" />
        <path d="M31 43 Q 35 40 39 37" stroke="#00E5FF" strokeWidth="0.6" strokeOpacity="0.65" fill="none" />

        {/* 5. Central/Bottom People Team silhouettes - 3 figures */}
        {/* Left Person Silhouette (Small) */}
        <g transform="translate(41.5, 48)">
          <path
            d="M -3,6 C -3,2.5 -1,1.5 2,1.5 C 5,1.5 7,2.5 7,6 Z"
            fill="url(#richBlueGrad)"
          />
          <circle cx="2" cy="-1.5" r="2" fill="url(#richBlueGrad)" />
        </g>

        {/* Right Person Silhouette (Small) */}
        <g transform="translate(54.5, 48)">
          <path
            d="M -3,6 C -3,2.5 -1,1.5 2,1.5 C 5,1.5 7,2.5 7,6 Z"
            fill="url(#richBlueGrad)"
          />
          <circle cx="2" cy="-1.5" r="2" fill="url(#richBlueGrad)" />
        </g>

        {/* Central Person Silhouette (Taller & Centered in front) */}
        <g transform="translate(46.5, 43)">
          <path
            d="M -3.5,8.5 C -3.5,4 0,3.5 3.5,3.5 C 7,3.5 10.5,4 10.5,8.5 Z"
            fill="url(#richBlueGrad)"
          />
          <circle cx="3.5" cy="-0.5" r="2.8" fill="url(#richBlueGrad)" />
          {/* Subtle outline separator for depth */}
          <path
            d="M -3.5,8.5 C -3.5,4 0,3.5 3.5,3.5 C 7,3.5 10.5,4 10.5,8.5"
            stroke="#FFFFFF"
            strokeWidth="0.5"
            fill="none"
          />
          <circle cx="3.5" cy="-0.5" r="2.8" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
        </g>

        {/* 6. Dynamic Sweeping Orbital Royal Blue Ribbon and Arrow */}
        {/* Sweeping outer loop trail under the globe */}
        <path
          d="M 23 45 C 20.5 68, 41 85, 73 66 C 85 57, 91.5 45, 92 34"
          stroke="url(#richBlueGrad)"
          strokeWidth="3.8"
          strokeLinecap="round"
          filter="url(#vectorDropShadow)"
        />
        {/* Highlighting inner vector line */}
        <path
          d="M 23 45 C 20.5 68, 41 85, 73 66 C 85 57, 91.5 45, 92 34"
          stroke="url(#neonBlueGrad)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />

        {/* Outer orbital swoosh arrow tail connection */}
        <path
          d="M 22 43 C 21.5 35, 25 24, 34 20"
          stroke="url(#richBlueGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeOpacity="0.3"
        />

        {/* Bold arrow head pointing dynamically top right */}
        <g transform="translate(91.8, 33) rotate(-28)">
          <path
            d="M -5.5 3 L 1 -5.5 L 7.5 3 L 1 1 Z"
            fill="url(#richBlueGrad)"
            stroke="url(#neonBlueGrad)"
            strokeWidth="0.5"
          />
        </g>
      </svg>

      {/* Corporate Modern Blue Brand Text "TCW" */}
      {showText && (
        <div className={`flex flex-col ${layout === 'vertical' ? 'items-center animate-fade-in' : 'text-left justify-center'}`}>
          <div className="flex items-baseline leading-none font-display">
            {/* T, C, W rendered together as TCW with a premium text gradient */}
            <span className={`${titleSize} text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-blue-500 font-black tracking-[0.05em]`}>
              TCW
            </span>
          </div>
          {/* Subtitle - only in horizontal layout */}
          {layout === 'horizontal' && (
            <span className={`${subtitleSize} text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-blue-500 uppercase mt-1.5 font-bold tracking-[0.2em] whitespace-nowrap`}>
              CONNECTING THE FUTURE
            </span>
          )}
        </div>
      )}
    </div>
  );
}
