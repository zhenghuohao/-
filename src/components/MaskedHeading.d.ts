import type { CSSProperties, ReactElement, ReactNode } from 'react'

export interface MaskedHeadingProps {
  /** 遮罩文字内容 */
  text?: ReactNode
  /** 填充媒体类型：视频或图片 */
  mediaType?: 'video' | 'image'
  /** 媒体地址（视频/图片） */
  src?: string
  /** 媒体填充放大比例 */
  fillScale?: number
  /** 滚动视差位移（px） */
  parallax?: number
  /** 入场水平漂移（px） */
  drift?: number
  /** 入场动画 */
  reveal?: 'rise' | 'none'
  /** 滚动触发方式 */
  trigger?: 'view' | 'none'
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 字重 */
  weight?: number
  /** 字间距（em） */
  tracking?: number
  /** 行高 */
  lineHeight?: number
  className?: string
  style?: CSSProperties
}

declare const MaskedHeading: (props: MaskedHeadingProps) => ReactElement | null

export default MaskedHeading
