import React from 'react'

interface Props {
  children: React.ReactNode
  count: number
  label: string
  compact?: boolean
}

export function CartoonStatCard({ children, count, label, compact = false }: Props) {
  return (
    <div
      className={`
        text-center relative overflow-hidden border border-black/15 transition-all duration-200 ease-out
        hover:shadow-[0_3px_8px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.7)]
        ${compact 
          ? 'rounded min-w-[28px] max-w-[32px] px-0.5 py-1 hover:-translate-y-0.5 hover:scale-[1.02]' 
          : 'rounded-md min-w-[38px] max-w-[42px] px-1 py-1.5 hover:-translate-y-1 hover:scale-[1.03]'
        }
      `}
      style={{
        background: 'linear-gradient(145deg, #f8f8f8 0%, #e8e8e8 100%)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.6)',
      }}
      title={label}
    >
      <div className={`flex flex-col items-center ${compact ? 'gap-0.5' : 'gap-1'}`}>
        <div className="flex items-center justify-center">
          {children}
        </div>
        <span
          className={`
            font-bold text-black/85 leading-none
            ${compact ? 'text-[0.65rem]' : 'text-xs'}
          `}
          style={{ textShadow: '0 1px 1px rgba(255,255,255,0.6)' }}
        >
          {count}
        </span>
      </div>
    </div>
  )
}
