import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import './MaskedHeading.css'

/**
 * MaskedHeading —— 视频/纹理遮罩文字
 * 将 text 作为 SVG 蒙版，把动态视频（或图片）裁成文字字形，
 * 实现"文字笔画内部随视频流动"的效果。
 *
 * 性能优化：
 * - 首屏用渐变回退，不立即加载视频
 * - 页面就绪后延迟加载视频（减少首屏阻塞）
 */
export function MaskedHeading({
  text,
  mediaType = 'video',
  src = `${import.meta.env.BASE_URL || '/'}hero-video-720.mp4`,
  fillScale = 1.15,
  parallax = 30,
  drift = 15,
  reveal = 'rise',
  trigger = 'view',
  align = 'left',
  weight = 900,
  tracking = -0.03,
  lineHeight = 1.0,
  className = '',
}) {
  const wrapRef = useRef(null)
  const str = String(text ?? '')
  const charCount = Array.from(str).length
  const [videoReady, setVideoReady] = useState(false)

  // 把文字字形编码进 SVG data URI 作为 CSS mask（比例按"每字 1 宽、字高 1"）
  const maskUri = useMemo(() => {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${(charCount + 0.15).toFixed(2)} 1">` +
      `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" ` +
      `font-family="Inter,'PingFang SC','Microsoft YaHei',sans-serif" ` +
      `font-weight="${weight}" font-size="0.95">${str}</text></svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  }, [str, charCount, weight])

  // 入场动画（rise + 水平漂移）+ 滚动视差
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      if (reveal === 'rise') {
        gsap.fromTo(
          el,
          { y: 44, x: -drift, opacity: 0 },
          { y: 0, x: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.15 },
        )
      }
      if (trigger === 'view' && parallax) {
        gsap.to(el, {
          y: parallax,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      }
    })
    return () => ctx.revert()
  }, [reveal, trigger, parallax, drift])

  // 页面就绪后延迟加载视频（减少首屏阻塞）
  useEffect(() => {
    if (mediaType !== 'video') return
    const timer = setTimeout(() => setVideoReady(true), 2000)
    return () => clearTimeout(timer)
  }, [mediaType])

  // 视频加载完成后淡入，渐变回退淡出
  useEffect(() => {
    if (!videoReady) return
    const video = document.querySelector('.masked-media video')
    if (!video) return

    const handleCanPlay = () => {
      video.preload = 'auto'
      video.classList.add('loaded')
      const fallback = document.querySelector('.masked-gradient-fallback')
      if (fallback) fallback.classList.add('fade-out')
    }

    video.addEventListener('canplay', handleCanPlay)
    return () => video.removeEventListener('canplay', handleCanPlay)
  }, [videoReady])

  // 渐变回退（首屏立即显示，不阻塞）
  const gradientFallback =
    'linear-gradient(135deg, #c0583a 0%, #f5a623 40%, #38bdf8 100%)'

  const media =
    mediaType === 'video' ? (
      <>
        {/* 渐变回退：首屏立即显示 */}
        {!videoReady && (
          <div
            className="masked-media masked-gradient-fallback"
            style={{ background: gradientFallback }}
          />
        )}
        {/* 视频：延迟加载 */}
        {videoReady && (
          <video
            className="masked-media"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src={src} type="video/mp4" />
          </video>
        )}
      </>
    ) : (
      <img
        className="masked-media"
        src={src}
        alt=""
        loading="eager"
        decoding="async"
      />
    )

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={str}
      className={`masked-heading ${className}`}
      style={{
        letterSpacing: `${tracking}em`,
        fontWeight: weight,
        lineHeight,
        textAlign: align === 'center' ? 'center' : align === 'right' ? 'right' : 'left',
      }}
    >
      {/* 被裁成文字字形的媒体层 */}
      <div className="masked-layer" style={{ maskImage: maskUri, WebkitMaskImage: maskUri }}>
        <div className="masked-fill" style={{ transform: `scale(${fillScale})` }}>
          {media}
        </div>
      </div>
      {/* 不可见占位文字：保持排版尺寸与基线 */}
      <span className="masked-placeholder" aria-hidden>
        {str}
      </span>
    </div>
  )
}

export default MaskedHeading
