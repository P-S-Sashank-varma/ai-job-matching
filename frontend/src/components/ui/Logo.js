import React from 'react';

const Logo = ({ size = 32, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle with gradient */}
      <circle
        cx="20"
        cy="20"
        r="19"
        fill="url(#gradient1)"
        stroke="url(#gradient2)"
        strokeWidth="1"
      />
      
      {/* AI Brain/Network pattern */}
      <g transform="translate(8, 8)">
        {/* Central node */}
        <circle cx="12" cy="12" r="3" fill="white" opacity="0.9" />
        
        {/* Connected nodes */}
        <circle cx="6" cy="6" r="2" fill="white" opacity="0.7" />
        <circle cx="18" cy="6" r="2" fill="white" opacity="0.7" />
        <circle cx="6" cy="18" r="2" fill="white" opacity="0.7" />
        <circle cx="18" cy="18" r="2" fill="white" opacity="0.7" />
        
        {/* Connection lines */}
        <line x1="12" y1="12" x2="6" y2="6" stroke="white" strokeWidth="1.5" opacity="0.6" />
        <line x1="12" y1="12" x2="18" y2="6" stroke="white" strokeWidth="1.5" opacity="0.6" />
        <line x1="12" y1="12" x2="6" y2="18" stroke="white" strokeWidth="1.5" opacity="0.6" />
        <line x1="12" y1="12" x2="18" y2="18" stroke="white" strokeWidth="1.5" opacity="0.6" />
        
        {/* Additional connecting lines between outer nodes */}
        <line x1="6" y1="6" x2="18" y2="6" stroke="white" strokeWidth="1" opacity="0.4" />
        <line x1="6" y1="18" x2="18" y2="18" stroke="white" strokeWidth="1" opacity="0.4" />
        <line x1="6" y1="6" x2="6" y2="18" stroke="white" strokeWidth="1" opacity="0.4" />
        <line x1="18" y1="6" x2="18" y2="18" stroke="white" strokeWidth="1" opacity="0.4" />
      </g>
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;