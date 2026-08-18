import { useEffect, useRef } from 'react'
import { useSkyTheme, type SkyPhase } from '../context/SkyContext'

export default function SkyBackground() {
  const vid1Ref = useRef<HTMLVideoElement>(null)
  const img2Ref = useRef<HTMLImageElement>(null)
  const vid3Ref = useRef<HTMLVideoElement>(null)
  const { setPhase } = useSkyTheme()

  /* --- 按需播放/暂停：不可见的视频立即暂停，停止解码，避免卡顿 --- */
  const syncPlayback = (vid: HTMLVideoElement | null, shouldPlay: boolean) => {
    if (!vid) return
    if (shouldPlay) {
      const p = vid.play()
      if (p) p.catch(() => {})
    } else if (!vid.paused) {
      vid.pause()
    }
  }

  /* --- 滚动监听：只在边界切换可见性，并真正暂停隐藏的视频 --- */
  useEffect(() => {
    const BOUNDARY_1 = 0.32
    const BOUNDARY_2 = 0.68
    let ticking = false
    let lastPhase = ''

    const updateVisibility = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0

      let phase: SkyPhase = 'sunset'
      if (progress >= BOUNDARY_2) phase = 'night'
      else if (progress >= BOUNDARY_1) phase = 'afternoon'

      if (phase !== lastPhase) {
        lastPhase = phase

        const v1 = progress < BOUNDARY_1
        const v2 = progress >= BOUNDARY_1 && progress < BOUNDARY_2
        const v3 = progress >= BOUNDARY_2

        if (vid1Ref.current) vid1Ref.current.style.visibility = v1 ? 'visible' : 'hidden'
        if (img2Ref.current) img2Ref.current.style.visibility = v2 ? 'visible' : 'hidden'
        if (vid3Ref.current) vid3Ref.current.style.visibility = v3 ? 'visible' : 'hidden'

        // 核心优化：隐藏的视频真正 pause，释放解码资源
        syncPlayback(vid1Ref.current, v1)
        syncPlayback(vid3Ref.current, v3)

        setPhase(phase)
      }
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        updateVisibility()
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateVisibility()
    return () => window.removeEventListener('scroll', onScroll)
  }, [setPhase])

  /* --- 标签页隐藏时暂停全部视频，恢复时按可见性续播 --- */
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        if (vid1Ref.current && !vid1Ref.current.paused) vid1Ref.current.pause()
        if (vid3Ref.current && !vid3Ref.current.paused) vid3Ref.current.pause()
      } else {
        syncPlayback(vid1Ref.current, vid1Ref.current?.style.visibility !== 'hidden')
        syncPlayback(vid3Ref.current, vid3Ref.current?.style.visibility !== 'hidden')
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  return (
    <div className="sky-bg">
      <video
        ref={vid1Ref}
        className="sky-layer"
        src="videos/seg1.mp4"
        loop muted playsInline autoPlay preload="auto"
      />
      <img
        ref={img2Ref}
        className="sky-layer"
        src="images/seg2.webp"
        alt=""
        loading="lazy"
        decoding="async"
      />
      <video
        ref={vid3Ref}
        className="sky-layer"
        src="videos/seg3.mp4"
        loop muted playsInline autoPlay preload="auto"
      />
    </div>
  )
}
