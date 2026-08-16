import type { CSSProperties, ReactElement, ReactNode } from 'react'

export interface BorderGlowProps {
  children?: ReactNode
  className?: string
  /** 边缘敏感度（0-100），越大光晕越容易亮起 */
  edgeSensitivity?: number
  /** 光晕主色，格式如 "40 80 80"（h s l） */
  glowColor?: string
  /** 卡片底色 */
  backgroundColor?: string
  /** 圆角（px） */
  borderRadius?: number
  /** 光晕扩散半径（px） */
  glowRadius?: number
  /** 光晕强度倍率 */
  glowIntensity?: number
  /** 光锥张角（度） */
  coneSpread?: number
  /** 自动扫光动画 */
  animated?: boolean
  /** 渐变配色数组 */
  colors?: string[]
  /** 渐变填充透明度（0-1） */
  fillOpacity?: number
  style?: CSSProperties
}

declare const BorderGlow: (props: BorderGlowProps) => ReactElement | null

export default BorderGlow
