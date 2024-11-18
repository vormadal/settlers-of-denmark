import { Box } from '@mui/material'

interface Props {
  children?: React.ReactNode
  color?: string
  offset: number
  width: number
  height: number
}
export function BaseCard({ children, color, offset, width, height }: Props) {
  return (
    <Box
      sx={{
        borderRadius: '0.5rem',
        border: '1px solid rgba(0, 0, 0, 0.5)',
        background: 'rgba(255, 255, 255)',
        width: width,
        height: height,
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
// css for stacking divs on top of each other
// .card-group {
//   display: flex;
// }
// .card {
//   position: relative;
//   flex: 1;
// }
// .card > div {
//   border-radius: 0.5rem;
//   border: 1px solid rgba(0, 0, 0, 0.5);
//   background: rgba(255, 255, 255);
//   width: 60px;
//   height: 80px;
//   padding: 2px;
//   position: absolute;
//   top: 0;
// }
// .card > div > div {
//   width: 100%;
//   height: 100%;
//   border-radius: 0.5rem;
// }
// .card > div > div:nth-child(1) {
