import { Box } from '@mui/material'

interface Props {
  children?: React.ReactNode
  color?: string
  offset: number
}
export function BaseCard({ children, color, offset }: Props) {
  return (
    <Box
      sx={{
        borderRadius: '0.5rem',
        border: '1px solid rgba(0, 0, 0, 0.5)',
        background: 'rgba(255, 255, 255)',
        width: 60,
        height: 80,
        padding: '2px',
        position: 'absolute',
        top: 0,
        left: offset
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: color,
          borderRadius: '0.5rem'
        }}
      ></Box>
    </Box>
  )
}