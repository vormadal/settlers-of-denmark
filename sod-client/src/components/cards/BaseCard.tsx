interface Props {
  children?: React.ReactNode
  color?: string
  width: number
  height: number
}
export function BaseCard({ children, color, width, height }: Props) {
  return (
    <div
      className="rounded-lg shadow-md border-2 border-white/80 transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg overflow-hidden flex items-center justify-center text-center relative"
      style={{
        background: `linear-gradient(145deg, ${color || '#ffffff'} 0%, ${color || '#ffffff'}CC 100%)`,
        width: width,
        height: height,
      }}
    >
      {/* Gloss effect */}
      <div 
        className="absolute top-0 left-0 right-0 h-[40%] pointer-events-none rounded-t-lg"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
        }}
      />
      
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}
