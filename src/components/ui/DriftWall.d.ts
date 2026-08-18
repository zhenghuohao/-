import type { CSSProperties } from 'react'

export interface DriftItem {
  image: string
  title?: string
  href?: string
}

export interface DriftWallProps {
  items?: DriftItem[]
  columns?: number
  tileWidth?: number
  tileHeight?: number
  gap?: number
  radius?: number
  tilt?: number
  turn?: number
  roll?: number
  perspective?: number
  depth?: number
  speed?: number
  direction?: 'up' | 'down'
  variance?: number
  parallax?: number
  pauseOnHover?: boolean
  lift?: number
  fade?: number
  dim?: number
  grayscale?: boolean
  overlayColor?: string
  className?: string
  style?: CSSProperties
  // 移动端适配参数
  mobileColumns?: number
  mobileTileWidth?: number
  mobileTileHeight?: number
  mobileGap?: number
  mobileTilt?: number
  mobileTurn?: number
  mobilePerspective?: number
  mobileDepth?: number
  mobileSpeed?: number
}

declare const DriftWall: (props: DriftWallProps) => import('react').JSX.Element
export default DriftWall
