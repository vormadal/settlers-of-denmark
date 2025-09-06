interface Props {
  size?: number
  color: string
}

export const DevelopmentIcon = ({ size = 20, color }: Props) => (
  <svg width={size} height={size} viewBox="-10 -10 20 20" style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))' }}>
    {/* Scroll base */}
    <path d="M-8,-9 Q-8,-10 -7,-10 L7,-10 Q8,-10 8,-9 L8,9 Q8,10 7,10 L-7,10 Q-8,10 -8,9 Z" 
          fill={color} stroke="#2C1810" strokeWidth="1"/>
    
    {/* Scroll curls at top and bottom */}
    <circle cx="-6" cy="-8" r="1.5" fill="none" stroke="#2C1810" strokeWidth="0.8"/>
    <circle cx="6" cy="-8" r="1.5" fill="none" stroke="#2C1810" strokeWidth="0.8"/>
    <circle cx="-6" cy="8" r="1.5" fill="none" stroke="#2C1810" strokeWidth="0.8"/>
    <circle cx="6" cy="8" r="1.5" fill="none" stroke="#2C1810" strokeWidth="0.8"/>
    
    {/* Magical star/gear symbol in center */}
    <path d="M0,-4 L1.5,-1.5 L4,0 L1.5,1.5 L0,4 L-1.5,1.5 L-4,0 L-1.5,-1.5 Z" 
          fill="#FFD700" stroke="#B8860B" strokeWidth="0.5"/>
    <circle cx="0" cy="0" r="1.2" fill="rgba(255,255,255,0.8)"/>
    
    {/* Text lines to suggest writing */}
    <rect x="-5" y="-6" width="10" height="0.8" rx="0.4" fill="rgba(139,69,19,0.4)"/>
    <rect x="-5" y="5" width="10" height="0.8" rx="0.4" fill="rgba(139,69,19,0.4)"/>
  </svg>
);
