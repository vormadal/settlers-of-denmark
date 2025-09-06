interface Props {
  size?: number
  color: string
}

export const ResourceIcon = ({ size = 20, color }: Props) => (
  <svg width={size} height={size} viewBox="-10 -10 20 20" style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))' }}>
    {/* Base container - hexagon to match game theme */}
    <path d="M-7,-4 L-7,4 L0,8 L7,4 L7,-4 L0,-8 Z" 
          fill={color} stroke="#2C1810" strokeWidth="1.2"/>
    
    {/* Resource stack representation */}
    {/* Bottom resource (ore/stone) */}
    <rect x="-5" y="2" width="10" height="3" rx="1" 
          fill="#8B7355" stroke="#5D4E37" strokeWidth="0.5"/>
    
    {/* Middle resource (wood) */}
    <ellipse cx="0" cy="0" rx="5" ry="2" 
             fill="#8B4513" stroke="#654321" strokeWidth="0.5"/>
    
    {/* Top resource (wheat/grain) */}
    <circle cx="-2" cy="-3" r="1.5" fill="#DAA520" stroke="#B8860B" strokeWidth="0.5"/>
    <circle cx="2" cy="-3" r="1.5" fill="#DAA520" stroke="#B8860B" strokeWidth="0.5"/>
    <circle cx="0" cy="-5" r="1.5" fill="#DAA520" stroke="#B8860B" strokeWidth="0.5"/>
    
    {/* Small highlights for texture */}
    <circle cx="-1" cy="-1" r="0.5" fill="rgba(255,255,255,0.4)"/>
    <circle cx="2" cy="3" r="0.5" fill="rgba(255,255,255,0.3)"/>
  </svg>
);
