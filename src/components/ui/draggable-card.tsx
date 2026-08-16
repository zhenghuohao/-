import { useEffect, useRef } from 'react'
import type { PointerEvent, ReactNode } from 'react'

interface DraggableCardContainerProps {
  children: ReactNode
  className?: string
}

/* 拍立得卡片堆叠容器：只负责布局，拖拽逻辑在 DraggableCardBody 内 */
export function DraggableCardContainer({
  children,
  className = '',
}: DraggableCardContainerProps) {
  return <div className={className}>{children}</div>
}

interface DraggableCardBodyProps {
  children: ReactNode
  className?: string
}

/* 可拖拽卡片：基于原生 Pointer 事件，兼容鼠标与触屏 */
export function DraggableCardBody({
  children,
  className = '',
}: DraggableCardBodyProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const drag = useRef({
    dragging: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    rotate: 0,
  })

  // 读取初始旋转角（Tailwind rotate-* 类通过 transform 实现），拖拽时叠加
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const tf = getComputedStyle(el).transform
    if (tf && tf !== 'none') {
      const m = tf.match(/matrix\(([-\d.]+),\s*([-\d.]+)/)
      if (m) {
        const a = parseFloat(m[1])
        const b = parseFloat(m[2])
        drag.current.rotate = Math.round((Math.atan2(b, a) * 180) / Math.PI)
      }
    }
  }, [])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    drag.current.dragging = true
    drag.current.pointerId = e.pointerId
    drag.current.startX = e.clientX
    drag.current.startY = e.clientY
    el.setPointerCapture(e.pointerId)
    el.style.transition = 'none'
    el.style.zIndex = '999'
    el.style.cursor = 'grabbing'
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el || !drag.current.dragging || e.pointerId !== drag.current.pointerId) {
      return
    }
    const dx = e.clientX - drag.current.startX
    const dy = e.clientY - drag.current.startY
    drag.current.offsetX += dx
    drag.current.offsetY += dy
    drag.current.startX = e.clientX
    drag.current.startY = e.clientY
    el.style.transform = `translate(${drag.current.offsetX}px, ${drag.current.offsetY}px) rotate(${drag.current.rotate}deg)`
  }

  const endDrag = () => {
    const el = cardRef.current
    if (!el || !drag.current.dragging) return
    drag.current.dragging = false
    drag.current.pointerId = -1
    el.style.transition = ''
    el.style.zIndex = ''
    el.style.cursor = ''
  }

  return (
    <div
      ref={cardRef}
      className={`cursor-grab touch-none select-none ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {children}
    </div>
  )
}
