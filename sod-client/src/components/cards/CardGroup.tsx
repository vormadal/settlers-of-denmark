import { BaseCard } from './BaseCard'

interface Props {
  color: string
  count: number
  maxSpacing?: number // Optional override for spacing
  onClick?: () => void // Optional click handler
}
const cardWidth = 40 // Increased from 32 for better visibility
const cardHeight = 60 // Increased from 48 for better visibility
const minSpacing = 1 // Minimum spacing between cards (reduced from 2)
const defaultMaxSpacing = 8 // Default maximum spacing between cards

// Export for use in PlayerCards
export const CARD_WIDTH = cardWidth
export const MIN_SPACING = minSpacing
export const DEFAULT_MAX_SPACING = defaultMaxSpacing
export function CardGroup({ color, count, maxSpacing = defaultMaxSpacing, onClick }: Props) {
  if (count === 0) return null
  
  // Calculate spacing based on constraints
  const calculateSpacing = (count: number): number => {
    if (count === 1) return 0
    return Math.max(minSpacing, Math.min(maxSpacing, maxSpacing))
  }
  
  const spacing = calculateSpacing(count)
  const groupWidth = cardWidth + (count - 1) * spacing
  
  return (
    <div 
      className={`flex flex-shrink-0 mr-2 ${onClick ? 'cursor-pointer' : 'cursor-default'} hover:[&_.card]:-translate-y-0.5`}
      onClick={onClick}
    >
      <div
        className="relative"
        style={{ width: groupWidth, height: cardHeight }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={`${color}-${index}`}
            className="card absolute top-0 transition-transform duration-200"
            style={{
              left: index * spacing,
              zIndex: index + 1,
            }}
          >
            <BaseCard
              color={color}
              width={cardWidth}
              height={cardHeight}
            />
          </div>
        ))}
        
        {/* Card count indicator - positioned on the last (top) card */}
        {count > 1 && (
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white rounded-full min-w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white/90 shadow-md"
            style={{
              left: (count - 1) * spacing + cardWidth / 2,
              zIndex: count + 10,
            }}
          >
            {count}
          </div>
        )}
      </div>
    </div>
  )
}
