interface Props {
  size?: number
  color: string
}

export const CityIcon = ({ size = 20, color }: Props) => (
  <svg width={size} height={size} viewBox="-12 -12 24 24" style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))' }}>
    <polygon 
      points="10,10 -10,10 -10,-10 -3,-10 -3,-3 3,-3 3,-10 10,-10" 
      fill={color}
      stroke="#000000"
      strokeWidth="1.2"
    />
  </svg>
);
