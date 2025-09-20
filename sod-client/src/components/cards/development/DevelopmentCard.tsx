import React from 'react'
import { CardVariants } from '../../../utils/CardVariants'
import { 
  KnightCard, 
  VictoryPointCard, 
  RoadBuildingCard, 
  MonopolyCard, 
  YearOfPlentyCard, 
  MerchantCard 
} from './index'

interface Props {
  variant: string
  width?: number
  height?: number
  onClick?: () => void
  disabled?: boolean
}

export function DevelopmentCard({ variant, width = 80, height = 120, onClick, disabled = false }: Props) {
  const cardProps = { width, height, onClick, disabled }
  
  switch (variant) {
    case CardVariants.Knight:
      return <KnightCard {...cardProps} />
    case CardVariants.VictoryPoint:
      return <VictoryPointCard {...cardProps} />
    case CardVariants.RoadBuilding:
      return <RoadBuildingCard {...cardProps} />
    case CardVariants.Monopoly:
      return <MonopolyCard {...cardProps} />
    case CardVariants.YearOfPlenty:
      return <YearOfPlentyCard {...cardProps} />
    case CardVariants.Merchant:
      return <MerchantCard {...cardProps} />
    default:
      console.warn(`Unknown development card variant: ${variant}`)
      return <KnightCard {...cardProps} />
  }
}