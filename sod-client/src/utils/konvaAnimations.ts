import Konva from 'konva'
import { Group } from 'konva/lib/Group'
import { RefObject, useEffect } from 'react'

interface PulseAnimationOptions {
  /**
   * Whether the animation should be active
   */
  enabled: boolean
  /**
   * The period of the animation in milliseconds
   * @default 2000
   */
  period?: number
  /**
   * The scale when animation is disabled
   * @default 1
   */
  defaultScale?: number
  /**
   * The scale variation amplitude (how much it pulses)
   * @default 0.1
   */
  scaleAmplitude?: number
}

/**
 * Custom hook that applies a pulse animation to a Konva Group element
 * Similar to the animation used in EdgeShape for upgradable settlements
 */
export function usePulseAnimation(shapeRef: RefObject<Group>, options: PulseAnimationOptions) {
  const { enabled, period = 2000, defaultScale = 1, scaleAmplitude = 0.1 } = options

  useEffect(() => {
    if (!enabled || !shapeRef.current) {
      shapeRef.current?.scale({ x: defaultScale, y: defaultScale })
      return
    }

    const anim = new Konva.Animation((frame) => {
      if (shapeRef.current) {
        // Scale +/- amplitude around defaultScale
        const scale = Math.sin(((frame?.time ?? 0) * 2 * Math.PI) / period) * scaleAmplitude + defaultScale
        shapeRef.current.scale({ x: scale, y: scale })
      }
    }, shapeRef.current?.getLayer() || undefined)

    anim.start()
    return () => {
      anim.stop()
    }
  }, [shapeRef, enabled, period, defaultScale, scaleAmplitude])
}
