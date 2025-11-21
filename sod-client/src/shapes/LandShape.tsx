import { Group, Line } from 'react-konva'
import { getCenter } from '../geometry/geometryUtils'
import Point from '../geometry/Point'

interface Props {
  color: string
  points: Point[]
  children?: React.ReactNode
  isHighlighted?: boolean
  onClick?: () => void
}

export function Land({ color, points, children, isHighlighted = false, onClick }: Readonly<Props>) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const center = getCenter(points)
  return (
    <Group
      onClick={handleClick}
      onTap={handleClick}
    >
      <Line points={[...points].flatMap(p => [p.x, p.y])}
        closed={true}
        stroke={isHighlighted ? '#ffff00' : '#000000'}
        strokeWidth={isHighlighted ? 3 : 1.5}
        fill={color} />
      <Group x={center.x} y={center.y}>
        {children}
      </Group>
    </Group>
  )
}
