interface Props {
  size?: number
  color: string
}

export const SettlementIcon = ({ size = 20, color }: Props) => (
  <svg width={size} height={size} viewBox="-15 -15 30 30" style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))' }}>
    <polygon 
      points="10,10 -10,10 -10,-5 0,-15 10,-5" 
      fill={color}
      stroke="#000000"
      strokeWidth="1.5"
    />
  </svg>
);
