import React from 'react';

interface CyberPunkLogoProps {
  size?: number;
  className?: string;
}

const CyberPunkLogo: React.FC<CyberPunkLogoProps> = ({ 
  size = 40, 
  className = "" 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer decorative ring */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="#8bd0d0"
        strokeWidth="2"
        strokeDasharray="8 4"
        opacity="0.6"
      />
      
      {/* Main robot head circle background */}
      <circle
        cx="50"
        cy="50"
        r="32"
        fill="#2a2f3f"
        stroke="#8bd0d0"
        strokeWidth="1.5"
      />
      
      {/* Top antenna/spike */}
      <path
        d="M50 18 L46 28 L54 28 Z"
        fill="#8bd0d0"
      />
      
      {/* Robot head main structure */}
      <path
        d="M35 30 L65 30 L65 55 Q65 65 55 65 L45 65 Q35 65 35 55 Z"
        fill="#1a1d29"
        stroke="#8bd0d0"
        strokeWidth="1"
      />
      
      {/* Left eye */}
      <circle
        cx="42"
        cy="42"
        r="4"
        fill="#8bd0d0"
        opacity="0.8"
      />
      
      {/* Right eye */}
      <circle
        cx="58"
        cy="42"
        r="4"
        fill="#8bd0d0"
        opacity="0.8"
      />
      
      {/* Eye connecting bridge */}
      <rect
        x="44"
        y="40"
        width="12"
        height="4"
        fill="#8bd0d0"
        opacity="0.6"
      />
      
      {/* Mouth/grille */}
      <rect
        x="40"
        y="52"
        width="20"
        height="8"
        fill="#2a2f3f"
        stroke="#8bd0d0"
        strokeWidth="1"
      />
      
      {/* Mouth grille lines */}
      <line x1="42" y1="54" x2="42" y2="58" stroke="#8bd0d0" strokeWidth="1"/>
      <line x1="46" y1="54" x2="46" y2="58" stroke="#8bd0d0" strokeWidth="1"/>
      <line x1="50" y1="54" x2="50" y2="58" stroke="#8bd0d0" strokeWidth="1"/>
      <line x1="54" y1="54" x2="54" y2="58" stroke="#8bd0d0" strokeWidth="1"/>
      <line x1="58" y1="54" x2="58" y2="58" stroke="#8bd0d0" strokeWidth="1"/>
      
      {/* Neck/collar */}
      <path
        d="M45 65 L55 65 L58 75 L42 75 Z"
        fill="#2a2f3f"
        stroke="#8bd0d0"
        strokeWidth="1"
      />
      
      {/* Neck detail lines */}
      <line x1="44" y1="68" x2="56" y2="68" stroke="#8bd0d0" strokeWidth="0.5"/>
      <line x1="45" y1="71" x2="55" y2="71" stroke="#8bd0d0" strokeWidth="0.5"/>
      
      {/* Side ear/speaker elements */}
      <circle
        cx="30"
        cy="45"
        r="3"
        fill="#8bd0d0"
        opacity="0.7"
      />
      <circle
        cx="70"
        cy="45"
        r="3"
        fill="#8bd0d0"
        opacity="0.7"
      />
      
      {/* Decorative corner elements */}
      <path
        d="M25 25 L20 20 L30 20 Z"
        fill="#8bd0d0"
        opacity="0.4"
      />
      <path
        d="M75 25 L80 20 L70 20 Z"
        fill="#8bd0d0"
        opacity="0.4"
      />
      <path
        d="M25 75 L20 80 L30 80 Z"
        fill="#8bd0d0"
        opacity="0.4"
      />
      <path
        d="M75 75 L80 80 L70 80 Z"
        fill="#8bd0d0"
        opacity="0.4"
      />
    </svg>
  );
};

export default CyberPunkLogo;