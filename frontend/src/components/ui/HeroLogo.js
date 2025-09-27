import React from 'react';

const HeroLogo = ({ size = 80, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle with gradient and glow effect */}
      <circle
        cx="40"
        cy="40"
        r="38"
        fill="url(#heroGradient1)"
        stroke="url(#heroGradient2)"
        strokeWidth="2"
      />
      
      {/* Inner glow circle */}
      <circle
        cx="40"
        cy="40"
        r="32"
        fill="none"
        stroke="url(#glowGradient)"
        strokeWidth="1"
        opacity="0.5"
      />
      
      {/* AI Network pattern - larger and more detailed */}
      <g transform="translate(16, 16)">
        {/* Central hub - larger */}
        <circle cx="24" cy="24" r="4" fill="white" opacity="0.95" />
        
        {/* Primary nodes */}
        <circle cx="12" cy="12" r="3" fill="white" opacity="0.8" />
        <circle cx="36" cy="12" r="3" fill="white" opacity="0.8" />
        <circle cx="12" cy="36" r="3" fill="white" opacity="0.8" />
        <circle cx="36" cy="36" r="3" fill="white" opacity="0.8" />
        
        {/* Secondary nodes */}
        <circle cx="24" cy="8" r="2" fill="white" opacity="0.6" />
        <circle cx="8" cy="24" r="2" fill="white" opacity="0.6" />
        <circle cx="40" cy="24" r="2" fill="white" opacity="0.6" />
        <circle cx="24" cy="40" r="2" fill="white" opacity="0.6" />
        
        {/* Primary connections */}
        <line x1="24" y1="24" x2="12" y2="12" stroke="white" strokeWidth="2" opacity="0.7" />
        <line x1="24" y1="24" x2="36" y2="12" stroke="white" strokeWidth="2" opacity="0.7" />
        <line x1="24" y1="24" x2="12" y2="36" stroke="white" strokeWidth="2" opacity="0.7" />
        <line x1="24" y1="24" x2="36" y2="36" stroke="white" strokeWidth="2" opacity="0.7" />
        
        {/* Secondary connections */}
        <line x1="24" y1="24" x2="24" y2="8" stroke="white" strokeWidth="1.5" opacity="0.5" />
        <line x1="24" y1="24" x2="8" y2="24" stroke="white" strokeWidth="1.5" opacity="0.5" />
        <line x1="24" y1="24" x2="40" y2="24" stroke="white" strokeWidth="1.5" opacity="0.5" />
        <line x1="24" y1="24" x2="24" y2="40" stroke="white" strokeWidth="1.5" opacity="0.5" />
        
        {/* Inter-node connections */}
        <line x1="12" y1="12" x2="36" y2="12" stroke="white" strokeWidth="1" opacity="0.4" />
        <line x1="12" y1="36" x2="36" y2="36" stroke="white" strokeWidth="1" opacity="0.4" />
        <line x1="12" y1="12" x2="12" y2="36" stroke="white" strokeWidth="1" opacity="0.4" />
        <line x1="36" y1="12" x2="36" y2="36" stroke="white" strokeWidth="1" opacity="0.4" />
        
        {/* Diagonal connections for more complex network */}
        <line x1="12" y1="12" x2="36" y2="36" stroke="white" strokeWidth="0.8" opacity="0.3" />
        <line x1="36" y1="12" x2="12" y2="36" stroke="white" strokeWidth="0.8" opacity="0.3" />
      </g>
      
      {/* Pulse animation circles */}
      <circle cx="40" cy="40" r="35" fill="none" stroke="url(#pulseGradient)" strokeWidth="0.5" opacity="0.3">
        <animate attributeName="r" values="30;38;30" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="heroGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="heroGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#10b981" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default HeroLogo;