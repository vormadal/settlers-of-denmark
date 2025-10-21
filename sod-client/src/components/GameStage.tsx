import { useState, useRef, useCallback, ReactNode } from 'react'
import { Stage } from 'react-konva'
import { KonvaEventObject } from 'konva/lib/Node'

interface GameStageProps {
  width: number
  height: number
  boardBounds: {
    xMin: number
    xMax: number
    yMin: number
    yMax: number
  }
  children: ReactNode
}

export function GameStage({ width: windowWidth, height: windowHeight, boardBounds, children }: GameStageProps) {
  const { xMin, xMax, yMin, yMax } = boardBounds
  const width = xMax - xMin
  const height = yMax - yMin

  const scaleWidth = windowWidth / width
  const scaleHeight = windowHeight / height
  const fitScale = Math.min(scaleWidth, scaleHeight)
  // Scale down by 10% to add some padding around the board
  const initialScale = fitScale * 0.9

  // Camera state for zoom and pan
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })
  const [stageScale, setStageScale] = useState(initialScale)
  const [isInitialized, setIsInitialized] = useState(false)
  const stageRef = useRef<any>(null)

  // Initialize camera position and scale on first load
  if (!isInitialized) {
    // Center the board in the window
    const initialOffsetX = (windowWidth - width * initialScale) / 2 - xMin * initialScale
    const initialOffsetY = (windowHeight - height * initialScale) / 2 - yMin * initialScale
    setStagePos({ x: initialOffsetX, y: initialOffsetY })
    setStageScale(initialScale)
    setIsInitialized(true)
  }

  // Handle wheel zoom
  const handleWheel = useCallback((e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()
    
    if (!stageRef.current) return
    
    const stage = stageRef.current
    const oldScale = stage.scaleX()
    const mousePointTo = {
      x: stage.getPointerPosition()!.x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition()!.y / oldScale - stage.y() / oldScale,
    }

    const scaleBy = 1.1
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy
    
    // Clamp scale between reasonable limits
    const clampedScale = Math.max(0.5, Math.min(3, newScale))
    
    setStageScale(clampedScale)
    setStagePos({
      x: -(mousePointTo.x - stage.getPointerPosition()!.x / clampedScale) * clampedScale,
      y: -(mousePointTo.y - stage.getPointerPosition()!.y / clampedScale) * clampedScale,
    })
  }, [])

  // Handle drag to pan
  const handleDragEnd = useCallback((e: KonvaEventObject<DragEvent>) => {
    setStagePos({
      x: e.target.x(),
      y: e.target.y(),
    })
  }, [])

  return (
    <Stage
      ref={stageRef}
      width={windowWidth}
      height={windowHeight}
      x={stagePos.x}
      y={stagePos.y}
      scaleX={stageScale}
      scaleY={stageScale}
      draggable
      onWheel={handleWheel}
      onDragEnd={handleDragEnd}
    >
      {children}
    </Stage>
  )
}