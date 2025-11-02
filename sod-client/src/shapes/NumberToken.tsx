import { Circle, Text } from 'react-konva'
import Point from '../geometry/Point'

interface Props {
  value?: number
  position?: Point
}
export default function NumberToken({ value, position }: Props) {
  if (value === undefined) return null
  return (
    <>
      <Circle
        radius={30}
        fill={'#ffffff'}
        x={position?.x}
        y={position?.y}
        opacity={0.6}
      />

      <Circle
        radius={30}
        stroke={'#000000'}
        strokeWidth={2}
        x={position?.x}
        y={position?.y}
      />

      <Text
        text={value?.toString() ?? ''}
        fontSize={30}
        align="center"
        verticalAlign="middle"
        width={50}
        height={50}
        x={(position?.x ?? 0) - 50 / 2}
        y={(position?.y ?? 0) - 50 / 2}
      />
    </>
  )
}
