interface Props {
  size?: number
  color: string
}

export const RoadIcon = ({ size = 20, color }: Props) => (
  <svg width={size} height={size} viewBox="-15 -6 30 12" style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))' }}>
    <polygon 
      points="12,4 4,1 -4,4 -12,1 -12,-4 -4,-1 4,-4 12,-1" 
      fill={color}
      stroke="#000000"
      strokeWidth="1"
    />
  </svg>
);
