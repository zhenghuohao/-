import type { CSSProperties, ReactElement } from 'react'

export interface MorphSliderItem {
  image?: string
  /** 视频源（优先于 image，作为动态纹理） */
  video?: string
  caption?: string
}

export type MorphTransition = 'melt' | 'ripple' | 'shear' | 'swirl'

export interface MorphSliderProps {
  items?: MorphSliderItem[]
  startIndex?: number
  transition?: MorphTransition
  duration?: number
  ease?: string
  intensity?: number
  scale?: number
  aberration?: number
  drift?: number
  autoplay?: boolean
  autoplayDelay?: number
  loop?: boolean
  radius?: number
  overlayColor?: string
  showCaptions?: boolean
  showControls?: boolean
  showIndicators?: boolean
  className?: string
  style?: CSSProperties
}

declare const MorphSlider: (props: MorphSliderProps) => ReactElement

export default MorphSlider
