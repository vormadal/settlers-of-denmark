import React from 'react'

interface Props {
  size?: number
  color?: string   // primary fill
  stroke?: string  // stroke / accent
  title?: string
}

export function KnightIcon({
  size = 24,
  color = '#8B4513',
  stroke = '#3b2a17',
  title = 'Knights Played',
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {/* Outer shield */}
      <path
        d="M12 2.5c2 .9 4.2 1.4 6.6 1.6.6 0 1 .5 1 1.1v5.7c0 5-3.4 8.9-7.6 10.6a1.3 1.3 0 0 1-1 0C6 19.8 2.4 16 2.4 10.9V5.2c0-.6.4-1 1-1.1A28 28 0 0 0 12 2.5Z"
        fill={color}
        stroke={stroke}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      {/* Vertical bar */}
      <path
        d="M12 5.2v11.9"
        stroke={stroke}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      {/* Cross bar */}
      <path
        d="M7.4 11.2h9.2"
        stroke={stroke}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      {/* Center boss */}
      <circle
        cx="12"
        cy="11.2"
        r="1.4"
        fill="#fff"
        opacity={0.4}
      />
    </svg>
  )
}