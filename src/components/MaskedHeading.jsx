import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import './MaskedHeading.css'

/**
 * MaskedHeading —— 视频/纹理遮罩文字
 * 将 text 作为 SVG 蒙版，把动态视频（或图片）裁成文字字形，
 * 实现"文字笔画内部随视频流动"的效果。
 */
export function MaskedHeading({
  text,
  mediaType = 'video',
  src = '/hero-video-720.mp4',
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

  const media =
    mediaType === 'video' ? (
      <video className="masked-media" autoPlay loop muted playsInline preload="auto">
        <source src={src} type="video/mp4" />
      </video>
    ) : (
      <img className="masked-media" src={src} alt="" loading="eager" decoding="async" />
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
