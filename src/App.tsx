import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SkyBackground from './components/SkyBackground'
import { SkyProvider, useSkyTheme } from './context/SkyContext'

// 06 / 求职彩蛋：AI 简历（舞蹈版），含 3D 模型，按需加载
const DanceCard = lazy(() => import('./components/DanceCard'))
// 能力卡片边缘光晕组件
import BorderGlow from './components/BorderGlow'
// 拍立得卡片堆叠：可拖拽容器（关于我模块）
import { DraggableCardContainer, DraggableCardBody } from './components/ui/draggable-card'
// 能力区标题 + 渐变按钮（03 / 优势）
import { CapabilityHeader } from './components/CapabilityHeader'
// 首页主标题：视频遮罩文字（郑国浩）
import MaskedHeading from './components/MaskedHeading'
// 精选作品：WebGL 液态变形轮播（按需加载，避免 ogl 进首屏包）
const MorphSlider = lazy(() => import('./components/MorphSlider'))
// 能力区：DriftWall 3D 透视滚动图片墙
import DriftWall from './components/ui/DriftWall'

gsap.registerPlugin(ScrollTrigger)

/* ============================================================
   郑国浩 · 个人作品集
   新海诚风格 · 日夜交替天空主题
   能源与动力工程 × 设计 / AI
   ============================================================ */

const NAV_LINKS = [
  { label: '经历', href: '#about' },
  { label: '项目', href: '#work' },
  { label: '优势', href: '#strengths' },
  { label: '联系', href: '#contact' },
]

const MORPH_ITEMS = [
  {
    image: '/project-1.webp',
    caption: 'AI与excel',
  },
  {
    image: '/project-2.webp',
    video: '/tank-demo.mp4',
    caption: '交互界面设计',
  },
  {
    image: '/project-3.webp',
    caption: 'AI与PPT',
  },
]

/* ============================================================
   能力卡片数据
   ============================================================ */
const STRENGTHS = [
  {
    title: 'AI 办公自动化',
    desc: 'AI 工具与 Excel 深度结合，覆盖意图识别、标签分类、信息抽取、摘要生成、格式统一等数据处理场景。',
    icon: '▣',
    level: 88,
  },
  {
    title: 'AI 演示制作',
    desc: '用 AI 高效搭建结构化演示文稿，强化内容组织与视觉呈现，让表达清晰而有说服力。',
    icon: '◈',
    level: 84,
  },
  {
    title: '独立开发能力',
    desc: '掌握 Vibe Coding，独立完成网站与小游戏的开发、调试与部署，具备从 0 到 1 的项目能力。',
    icon: '⌘',
    level: 80,
  },
  {
    title: '视觉与审美',
    desc: '对信息层级与视觉秩序有敏锐感知，喜欢以克制的暗色体系组织视觉表达，持续打磨自己的设计品味。',
    icon: '◉',
    level: 86,
  },
  {
    title: '英语口语',
    desc: '高考英语 121 分，正在备考 CET-4，注重英语口语练习，愿意主动开口交流。',
    icon: '↗',
    level: 78,
  },
  {
    title: '核心素养',
    desc: '责任心强、做事细致、学习能力强，拥有突出的团队合作与组织协调能力。',
    icon: '✺',
    level: 90,
  },
]

/* DriftWall 能力墙瓦片：SVG data URI（不依赖外网图片） */
function abilityTileSvg(s: (typeof STRENGTHS)[number]) {
  const barW = Math.round((s.level / 100) * 472)
  const d1 = s.desc.slice(0, 23)
  const d2 = s.desc.slice(23, 46)
  const d3 = s.desc.slice(46, 69)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">` +
    `<defs>` +
    `<linearGradient id="bg" x1="0" y1="0" x2="600" y2="400" gradientUnits="userSpaceOnUse">` +
    `<stop offset="0" stop-color="#14141d"/><stop offset="1" stop-color="#232334"/>` +
    `</linearGradient>` +
    `<linearGradient id="bar" x1="0" y1="0" x2="472" y2="0" gradientUnits="userSpaceOnUse">` +
    `<stop offset="0" stop-color="#c084fc"/><stop offset="1" stop-color="#38bdf8"/>` +
    `</linearGradient>` +
    `</defs>` +
    `<rect width="600" height="400" rx="28" fill="url(#bg)"/>` +
    `<circle cx="520" cy="50" r="150" fill="#c084fc" opacity="0.12"/>` +
    `<circle cx="50" cy="370" r="130" fill="#38bdf8" opacity="0.08"/>` +
    `<text x="64" y="132" font-size="92" fill="#c084fc" font-family="'Segoe UI Symbol','Noto Sans Symbols2',sans-serif">${s.icon}</text>` +
    `<text x="536" y="116" font-size="64" font-weight="700" fill="#c084fc" text-anchor="middle" font-family="'Segoe UI',sans-serif">${s.level}%</text>` +
    `<text x="64" y="226" font-size="48" font-weight="700" fill="#ffffff" font-family="'Microsoft YaHei','PingFang SC',sans-serif">${s.title}</text>` +
    `<rect x="64" y="262" width="472" height="12" rx="6" fill="#ffffff" opacity="0.10"/>` +
    `<rect x="64" y="262" width="${barW}" height="12" rx="6" fill="url(#bar)"/>` +
    `<text x="64" y="318" font-size="20" fill="#9d9db0" font-family="'Microsoft YaHei','PingFang SC',sans-serif">${d1}</text>` +
    `<text x="64" y="346" font-size="20" fill="#9d9db0" font-family="'Microsoft YaHei','PingFang SC',sans-serif">${d2}</text>` +
    `<text x="64" y="374" font-size="20" fill="#9d9db0" font-family="'Microsoft YaHei','PingFang SC',sans-serif">${d3}</text>` +
    `</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const DRIFT_ITEMS = STRENGTHS.map((s) => ({ image: abilityTileSvg(s), title: s.title }))

/* ============================================================
   动态按钮：磁性吸附 + 点击波纹 + 流光
   ============================================================ */
function DynamicButton({
  href,
  children,
  variant = 'solid',
  onClick,
  className = '',
}: {
  href: string
  children: React.ReactNode
  variant?: 'solid' | 'outline' | 'glass'
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  className?: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const patternId = useRef(`dotted-${Math.random().toString(36).slice(2, 9)}`).current
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const rafRef = useRef(0)

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current
    if (!r) return
    const rect = r.getBoundingClientRect()
    const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      setPos({ x: nx * 10, y: ny * 10 })
    })
  }
  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const onDown = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = ref.current
    if (r) {
      const rect = r.getBoundingClientRect()
      const id = Date.now() + Math.random()
      setRipples((p) => [
        ...p,
        { x: e.clientX - rect.left, y: e.clientY - rect.top, id },
      ])
      window.setTimeout(
        () => setRipples((p) => p.filter((rp) => rp.id !== id)),
        750,
      )
    }
    onClick?.(e)
  }

  const base = 'btn-shine btn-magnetic relative overflow-hidden rounded-full px-7 py-3 text-sm font-medium'
  const solid = 'btn-aurora'
  const outline =
    'border border-white/15 text-white/70 hover:border-amber-400/50 hover:bg-white/10 hover:text-white hover:shadow-[0_8px_30px_rgba(245,166,35,0.2)]'

  if (variant === 'glass') {
    return (
      <a href={href} onClick={onDown} className={`inline-block ${className}`}>
        <div className="button-wrap shrink-0">
          <button type="button">
            <span>{children}</span>
          </button>
          <div className="button-shadow" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="100%"
            width="100%"
            style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
          >
            <defs>
              <pattern patternUnits="userSpaceOnUse" height="30" width="30" id={patternId}>
                <circle fill="rgba(0,0,0,0.15)" r="1" cy="2" cx="2"></circle>
              </pattern>
            </defs>
            <rect fill={`url(#${patternId})`} height="100%" width="100%"></rect>
          </svg>
        </div>
      </a>
    )
  }

  return (
    <a
      ref={ref}
      href={href}
      onClick={onDown}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setPos({ x: 0, y: 0 })
      }}
      className={`${base} ${variant === 'solid' ? solid : outline} ${className}`}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px) scale(${hovered ? 1.07 : 1})`,
        transition:
          'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.3s',
      }}
    >
      <span className="relative z-10 inline-block transition-transform duration-200"
            style={{ transform: hovered ? 'translateX(2px)' : undefined }}>
        {children}
      </span>
      {ripples.map((rp) => (
        <span
          key={rp.id}
          className="btn-ripple"
          style={{
            left: rp.x,
            top: rp.y,
          }}
        />
      ))}
    </a>
  )
}

/* ============================================================
   导航栏：滚动后切换为磨砂玻璃质感
   ============================================================ */
function Navbar() {
  const [open, setOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const next = window.scrollY > 80
        setScrolled((prev) => (prev === next ? prev : next))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: 'power3.out' },
    )
  }, [])

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
        scrolled
          ? 'border-white/10 bg-white/10 backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1700px] items-center justify-between px-6 md:px-10">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-mono-num text-sm tracking-[0.3em] text-white/70">
            ZGH
          </span>
          <span className="text-sm text-white/50">· 个人简历</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <DynamicButton
            href="#contact"
            variant="outline"
            className="!border-amber-400/30 !px-5 !py-1.5 !text-white/70"
          >
            联系我
          </DynamicButton>
        </nav>

        <button
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="菜单"
        >
          <span
            className={`h-px w-5 bg-white/70 transition-transform ${open ? 'translate-y-[3.5px] rotate-45' : ''}`}
          />
          <span
            className={`h-px w-5 bg-white/70 transition-transform ${open ? '-translate-y-[3px] -rotate-45' : ''}`}
          />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 border-t border-white/8 bg-black/30 px-6 py-5 backdrop-blur-xl md:hidden">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-base text-white/60"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="text-base text-white/70"
          >
            联系我
          </a>
        </nav>
      )}
    </header>
  )
}

/* ============================================================
   Hero 首屏
   ============================================================ */
function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLParagraphElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const onCta = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href')
    if (href?.startsWith('#')) {
      e.preventDefault()
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    tl.fromTo(
      overlayRef.current,
      { scaleY: 1, transformOrigin: 'center center' },
      { scaleY: 0, duration: 1.4, ease: 'power3.inOut' },
    )
      .fromTo(
        videoWrapRef.current,
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 1.2 },
        '-=0.7',
      )
      .fromTo(tagRef.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.8')
      .fromTo(subRef.current, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')
      .fromTo(descRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.35')
      .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
      .fromTo(hintRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.2')

    const hero = heroRef.current
    if (hero) {
      gsap.to(videoWrapRef.current, {
        yPercent: 16, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(contentRef.current, {
        y: -90, opacity: 0.15, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(hintRef.current, {
        opacity: 0, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      })
    }

    return () => { tl.kill() }
  }, [])

  // Hero 文字用白色（夕阳背景上可读）
  const heroTextColors = {
    tag: 'text-amber-300/80',
    name: 'text-white',
    sub: 'text-white/70',
    desc: 'text-white/55',
  }

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <div ref={videoWrapRef} className="absolute inset-0 opacity-0">
        {/* Hero 背景：保留视频遮罩，但添加半透明遮罩确保文字可读 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      {/* 入场遮罩 */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-b from-[#1a1a3e] to-[#c0583a]"
      />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-[1700px] px-6 md:px-10"
      >
        <p
          ref={tagRef}
          className={`font-mono-num mb-6 text-xs tracking-[0.4em] ${heroTextColors.tag}`}
        >
          PORTFOLIO — 2026
        </p>

        <MaskedHeading
          text="郑国浩"
          src="/hero-video-720.mp4"
          mediaType="video"
          fillScale={1.15}
          parallax={0}
          drift={15}
          reveal="rise"
          trigger="view"
          align="left"
          weight={900}
          tracking={-0.03}
          lineHeight={1.0}
          className={`text-6xl sm:text-7xl lg:text-8xl ${heroTextColors.name}`}
        />

        <p
          ref={subRef}
          className={`mt-4 text-xl font-medium tracking-wide md:text-2xl ${heroTextColors.sub}`}
        >
          能源与动力工程 · 准大一 · 热爱设计与 AI
        </p>

        <p
          ref={descRef}
          className={`mt-6 max-w-2xl text-lg leading-relaxed ${heroTextColors.desc}`}
        >
          即将进入天津商业大学能源与动力工程专业的准大一新生。热爱设计与 AI，正在学习用科技与审美表达想法。
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
          <DynamicButton href="#work" variant="glass" onClick={onCta}>查看作品</DynamicButton>
          <DynamicButton href="#contact" variant="outline" onClick={onCta}>联系我</DynamicButton>
        </div>
      </div>

      {/* 滚动提示 */}
      <div ref={hintRef} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="h-10 w-5 rounded-full border border-white/20">
          <div className="mx-auto mt-1.5 h-2 w-px bg-white/50" />
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   巨型水印标题
   ============================================================ */
function Watermark({
  text,
  align = 'right',
  dir = -1,
}: {
  text: string
  align?: 'left' | 'right'
  dir?: -1 | 1
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const { colors } = useSkyTheme()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const tween = gsap.fromTo(
      el,
      { x: dir * 220, opacity: 0 },
      {
        x: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [dir])

  return (
    <h2
      ref={ref}
      className={`pointer-events-none absolute -top-3 select-none text-[clamp(3.5rem,10vw,9rem)] font-bold leading-none tracking-tight ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
      style={{ color: colors.textMuted }}
    >
      {text}
    </h2>
  )
}

/* 通用滚动揭示 */
function Reveal({
  children,
  y = 40,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  y?: number
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const tween = gsap.fromTo(
      el,
      { y, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9, delay, ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      },
    )
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [y, delay])

  return <div ref={ref} className={className}>{children}</div>
}

/* 通用区块标题 */
function SectionHeading({
  index,
  title,
  sub,
}: {
  index: string
  title: string
  sub?: string
}) {
  const { colors } = useSkyTheme()
  return (
    <div className="mb-12 md:mb-16">
      <p className="font-mono-num mb-3 text-xs tracking-[0.35em]" style={{ color: colors.textMuted }}>
        {index}
      </p>
      <h2 className={`title-glow title-sweep text-3xl font-semibold tracking-tight md:text-5xl`}
          style={{ color: colors.textPrimary }}>
        {title}
      </h2>
      {sub && (
        <p className="mt-4 max-w-xl text-sm leading-relaxed md:text-base" style={{ color: colors.textSecondary }}>
          {sub}
        </p>
      )}
    </div>
  )
}

/* ============================================================
   关于我
   ============================================================ */
function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const { colors } = useSkyTheme()

  return (
    <section ref={sectionRef} id="about" className="relative py-24 md:py-36">
      <div className="neon-line pointer-events-none absolute inset-x-0 top-0" />
      <div className="relative mx-auto w-full max-w-[1700px] px-6 md:px-10">
        <Watermark text="ABOUT" align="right" dir={-1} />
        <SectionHeading
          index="01 / 经历"
          title="关于我"
          sub="从数据到视觉，从逻辑到表达——把每一件小事做成系统。"
        />

        <div className="relative mt-8 w-full">
          <BorderGlow
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor="#F8F7F4"
            borderRadius={32}
            glowRadius={60}
            glowIntensity={1.0}
            colors={['#c084fc', '#f472b6', '#38bdf8']}
            fillOpacity={0.5}
            className="relative h-[600px] w-full overflow-hidden rounded-[32px] shadow-inner"
            style={{
              background: colors.cardBg,
              borderColor: colors.cardBorder,
            }}
          >
            <DraggableCardContainer className="relative flex h-full w-full items-center justify-center">
              {/* 1. 联系方式卡片 */}
              <DraggableCardBody className="absolute left-[5%] top-16 z-20 rotate-[-6deg]">
                <div className="w-[200px] rounded-sm bg-white/90 p-4 pb-6 shadow-2xl transition-all hover:z-50"
                     style={{ color: colors.textPrimary }}>
                  <div className="mb-3 flex h-[140px] w-full items-center justify-center rounded-sm bg-gradient-to-br from-blue-50 to-indigo-100 text-2xl text-gray-400">📞</div>
                  <h4 className="text-center text-base font-bold">联系方式</h4>
                  <p className="mt-1 whitespace-pre-line text-center text-[10px] leading-relaxed text-gray-500">电话 19816791893{'\n'}邮箱 2722281439@qq.com{'\n'}籍贯 贵州</p>
                </div>
              </DraggableCardBody>

              {/* 2. 天津商业大学 */}
              <DraggableCardBody className="absolute left-[42%] top-10 z-10 rotate-[4deg]">
                <div className="w-[200px] rounded-sm bg-white/90 p-4 pb-6 shadow-2xl transition-all hover:z-50"
                     style={{ color: colors.textPrimary }}>
                  <div className="mb-3 flex h-[140px] w-full items-center justify-center rounded-sm bg-gradient-to-br from-emerald-50 to-green-100 text-2xl text-gray-400">🎓</div>
                  <h4 className="text-center text-base font-bold">天津商业大学</h4>
                  <p className="mt-1 whitespace-pre-line text-center text-[10px] leading-relaxed text-gray-500">能源与动力工程 · 本科{'\n'}2026.09 – 2030.06</p>
                </div>
              </DraggableCardBody>

              {/* 3. 贵州省实验高级中学 */}
              <DraggableCardBody className="absolute bottom-20 left-[28%] z-30 rotate-[-8deg]">
                <div className="w-[200px] rounded-sm bg-white/90 p-4 pb-6 shadow-2xl transition-all hover:z-50"
                     style={{ color: colors.textPrimary }}>
                  <div className="mb-3 flex h-[140px] w-full items-center justify-center rounded-sm bg-gradient-to-br from-orange-50 to-amber-100 text-2xl text-gray-400">🏫</div>
                  <h4 className="text-center text-base font-bold">贵州省实验高级中学</h4>
                  <p className="mt-1 whitespace-pre-line text-center text-[10px] leading-relaxed text-gray-500">高中 · 年级排名前100{'\n'}2023.09 – 2026.06</p>
                </div>
              </DraggableCardBody>

              {/* 4. 班级学习委员 */}
              <DraggableCardBody className="absolute right-[15%] top-28 z-10 rotate-[12deg]">
                <div className="w-[200px] rounded-sm bg-white/90 p-4 pb-6 shadow-2xl transition-all hover:z-50"
                     style={{ color: colors.textPrimary }}>
                  <div className="mb-3 flex h-[140px] w-full items-center justify-center rounded-sm bg-gradient-to-br from-pink-50 to-rose-100 text-2xl text-gray-400">📝</div>
                  <h4 className="text-center text-base font-bold">班级学习委员</h4>
                  <p className="mt-1 whitespace-pre-line text-center text-[10px] leading-relaxed text-gray-500">作业反馈与统计{'\n'}组织班级学习小组</p>
                </div>
              </DraggableCardBody>

              {/* 5. 篮球社团成员 */}
              <DraggableCardBody className="absolute bottom-24 right-[35%] z-20 rotate-[-3deg]">
                <div className="w-[200px] rounded-sm bg-white/90 p-4 pb-6 shadow-2xl transition-all hover:z-50"
                     style={{ color: colors.textPrimary }}>
                  <div className="mb-3 flex h-[140px] w-full items-center justify-center rounded-sm bg-gradient-to-br from-cyan-50 to-teal-100 text-2xl text-gray-400">🏀</div>
                  <h4 className="text-center text-base font-bold">篮球社团成员</h4>
                  <p className="mt-1 whitespace-pre-line text-center text-[10px] leading-relaxed text-gray-500">参与团队对抗赛{'\n'}承担新人带练角色</p>
                </div>
              </DraggableCardBody>

              <p className="pointer-events-none absolute left-1/2 top-1/2 z-0 max-w-xs -translate-x-1/2 -translate-y-1/2 select-none text-center text-3xl font-extrabold"
                 style={{ color: colors.textMuted }}>ABOUT</p>
            </DraggableCardContainer>
          </BorderGlow>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   精选作品
   ============================================================ */
function Work() {
  const sectionRef = useRef<HTMLElement>(null)
  const { colors } = useSkyTheme()

  return (
    <section ref={sectionRef} id="work" className="relative py-24 md:py-36">
      <div className="neon-line pointer-events-none absolute inset-x-0 top-0" />
      <div className="relative mx-auto w-full max-w-[1700px] px-6 md:px-10">
        <Watermark text="WORK" align="left" dir={1} />
        <SectionHeading
          index="02 / 项目"
          title="精选作品"
          sub="用 AI 与设计思维完成的代表项目——从想法到可运行的作品。"
        />

        <div className="mt-14 mb-3 flex items-center gap-2 text-xs tracking-[0.25em]"
             style={{ color: colors.textMuted }}>
          <span className="inline-block h-px w-6 bg-gradient-to-r from-[#c084fc] to-transparent" />
          HOVER TO EXPLORE — 鼠标悬停可查看项目详情
          <span className="ml-auto inline-flex items-center gap-1 opacity-60">
            <svg className="h-3.5 w-3.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
            试试鼠标移上去
          </span>
        </div>

        <div className="relative h-[480px] w-full overflow-hidden rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.1)] md:h-[560px]">
          <Suspense
            fallback={
              <div
                className="morph-slider h-full w-full"
                style={{ background: '#0c0c0e' }}
                aria-busy="true"
              />
            }
          >
            <MorphSlider
              items={MORPH_ITEMS}
              transition="melt"
              intensity={0.55}
              aberration={0.35}
              drift={0.4}
              autoplay={false}
              overlayColor="#05060a"
              duration={1.1}
              ease="power2.inOut"
              scale={2.4}
              autoplayDelay={4}
              loop
              radius={16}
              showCaptions
              showControls
              showIndicators
            />
          </Suspense>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   优势 / 能力
   ============================================================ */
function Strengths() {

  return (
    <section id="strengths" className="relative py-24 md:py-36">
      <div className="neon-line pointer-events-none absolute inset-x-0 top-0" />
      <div className="relative mx-auto w-full max-w-[1700px] px-6 md:px-10">
        <Watermark text="SKILLS" align="right" dir={-1} />
        <CapabilityHeader />

        <div className="mt-14 h-[560px] w-full md:h-[620px]">
          <DriftWall
            items={DRIFT_ITEMS}
            columns={3}
            tileWidth={240}
            tileHeight={160}
            gap={16}
            tilt={16}
            turn={-14}
            perspective={1100}
            depth={110}
            speed={42}
            direction="up"
            variance={0.45}
            parallax={0.6}
            lift={60}
            fade={0.5}
            dim={0.88}
            overlayColor="#0a0812"
            radius={14}
            pauseOnHover={false}
          />
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   联系
   ============================================================ */
function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const { colors } = useSkyTheme()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const glow = sectionRef.current?.querySelector('.contact-glow')
      if (glow) {
        gsap.fromTo(
          glow,
          { y: 140, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.4, ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden py-24 md:py-32"
    >
      <div className="neon-line pointer-events-none absolute inset-x-0 top-0" />
      <div className="contact-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(245,166,35,0.12),transparent_60%),radial-gradient(circle_at_90%_15%,rgba(123,104,238,0.08),transparent_55%)]" />
      <div className="relative mx-auto w-full max-w-[1700px] px-6 md:px-10">
        <Reveal>
          <p className="font-mono-num mb-6 text-xs tracking-[0.35em]" style={{ color: colors.textMuted }}>
            04 / 联系
          </p>
          <h2 className="title-glow max-w-4xl text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[1.08] tracking-tight"
              style={{ color: colors.textPrimary }}>
            一起，把想法
            <span style={{ color: 'var(--accent-gold)' }}>变成作品</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed" style={{ color: colors.textSecondary }}>
            设计与 AI 是我的兴趣方向。无论是校园项目、社团活动，
            还是学习上的交流，欢迎随时联系。
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-14 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <a
                href="mailto:2722281439@qq.com"
                className="group block border-b border-white/10 pb-3 transition-colors hover:border-amber-400/40"
              >
                <span className="text-xs" style={{ color: colors.textMuted }}>邮箱</span>
                <span className="mt-1 block text-lg transition-colors group-hover:text-amber-400 md:text-2xl"
                      style={{ color: colors.textPrimary }}>
                  2722281439@qq.com
                </span>
              </a>
              <div className="border-b border-white/10 pb-3">
                <span className="text-xs" style={{ color: colors.textMuted }}>电话</span>
                <span className="mt-1 block font-mono-num text-lg md:text-2xl"
                      style={{ color: colors.textPrimary }}>
                  198 1679 1893
                </span>
              </div>
              <div className="border-b border-white/10 pb-3">
                <span className="text-xs" style={{ color: colors.textMuted }}>基地</span>
                <span className="mt-1 block text-lg md:text-2xl"
                      style={{ color: colors.textPrimary }}>
                  贵州 · 天津商业大学
                </span>
              </div>
            </div>

            <DynamicButton
              href="mailto:2722281439@qq.com"
              variant="glass"
              className="self-start md:self-auto"
            >
              发送邮件
            </DynamicButton>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-24 flex flex-col gap-3 border-t border-white/8 pt-8 text-xs md:flex-row md:items-center md:justify-between"
               style={{ color: colors.textMuted }}>
            <p>© 2026 郑国浩 · 能源与动力工程准大一</p>
            <p className="font-mono-num tracking-widest">
              DESIGN & DEVELOP BY ZGH — 2026
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ============================================================
   主应用组件
   ============================================================ */
export default function App() {
  const modelGateRef = useRef<HTMLDivElement>(null)
  const [showModel, setShowModel] = useState(false)

  // 求职彩蛋区块门控
  useEffect(() => {
    const el = modelGateRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowModel(true)
          io.disconnect()
        }
      },
      { rootMargin: '700px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // 全局滚动进度条：顶部渐变条
  useEffect(() => {
    const bar = document.createElement('div')
    bar.className =
      'fixed inset-x-0 top-0 z-[60] h-1 origin-left scale-x-0 bg-gradient-to-r from-amber-400 via-purple-500 to-blue-500'
    document.body.appendChild(bar)
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        bar.style.transform = `scaleX(${self.progress})`
      },
    })
    return () => {
      st.kill()
      bar.remove()
    }
  }, [])

  return (
    <SkyProvider>
      <SkyBackground />
      <main className="relative z-10 min-h-screen">
        <Navbar />
        <Hero />
        <About />
        <Work />
        <Strengths />
        <Contact />
        {/* 求职彩蛋：滚动接近末尾时才挂载 */}
        <div ref={modelGateRef}>
          {showModel ? (
            <Suspense fallback={<div className="min-h-screen" />}>
              <DanceCard />
            </Suspense>
          ) : (
            <div className="min-h-screen" aria-hidden />
          )}
        </div>
      </main>
    </SkyProvider>
  )
}
