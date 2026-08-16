import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 06 / 求职彩蛋：AI 简历（舞蹈版），含 3D 模型，按需加载
const DanceCard = lazy(() => import('./components/DanceCard'))
// 能力卡片边缘光晕组件（紫粉蓝霓虹描边，hover 跟随鼠标角度亮起）
import BorderGlow from './components/BorderGlow'
// 拍立得卡片堆叠：可拖拽容器（关于我模块）
import { DraggableCardContainer, DraggableCardBody } from './components/ui/draggable-card'
// 能力区标题 + 渐变按钮（03 / 优势）
import { CapabilityHeader } from './components/CapabilityHeader'
// 首页主标题：视频遮罩文字（郑国浩）
import MaskedHeading from './components/MaskedHeading'
// 精选作品：WebGL 液态变形轮播
import MorphSlider from './components/MorphSlider'

gsap.registerPlugin(ScrollTrigger)

/* ============================================================
   郑国浩 · 个人作品集
   视觉设计师 / AI 设计师 / 品牌设计师
   准大一新生 · 热爱设计与 AI
   暗色 · 克制 · 科技感
   ============================================================ */

/* ---------- Hero 背景：水墨流动视频 + 静态水墨山水图兜底 ----------
   视频：public/hero-video.mp4（Pixabay CC0 黑白液态水墨，缓慢流动）
   兜底图：public/bg-new-chinese-ink.jpg（16:9 暖米白纸底 + 淡墨山峦）
   两者都与全站浅色纸主题保持一致。若要替换，直接换 public 下同名文件即可。 */
const HERO_VIDEO = '/hero-video-720.mp4'
const HERO_BG = '/bg-new-chinese-ink.jpg'

const NAV_LINKS = [
  { label: '经历', href: '#about' },
  { label: '项目', href: '#work' },
  { label: '优势', href: '#strengths' },
  { label: '联系', href: '#contact' },
]

// 精选作品轮播内容（图片已下载到 public/，本地路径同源加载，避免 trae-api 重定向无 CORS 头的问题）
const MORPH_ITEMS = [
  {
    image: '/project-1.jpg',
    caption: 'AI与excel',
  },
  {
    image: '/project-2.jpg',
    video: '/tank-demo.mp4?v=2', // 坦克大战实况录制，作为动态视频 slide
    caption: '交互界面设计',
  },
  {
    image: '/project-3.jpg',
    caption: 'AI与PPT',
  },
]

/* ============================================================
   能力卡片数据：6 项核心能力（图标 + 名称 + 描述 + 熟练度）
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

/* ============================================================
   Hero 背景：水墨流动视频（public/hero-video-720.mp4，Pixabay CC0）
   720p 重编码版（原 2K 文件解码负载重，易造成整页卡顿）；
   黑白液态水墨缓慢流动，叠加米白遮罩提亮成淡墨宣纸质感；
   滚动离开首屏时暂停播放，进一步释放解码资源；
   视频加载失败时自动降级为静态水墨山水图。
   ============================================================ */
function HeroBg() {
  const [videoOk, setVideoOk] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // 首屏可见才播放，离开首屏立即暂停（避免后台持续解码拖慢整页）
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (e.isIntersecting) {
          v.play().catch(() => {})
        } else {
          v.pause()
        }
      },
      { threshold: 0.08 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#F5F5F0]">
      {videoOk ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_BG}
          onError={() => setVideoOk(false)}
          className="h-full w-full object-cover"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      ) : (
        <img
          src={HERO_BG}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
        />
      )}
      {/* 米白遮罩：提亮画面，让墨迹如淡墨晕染在宣纸上 */}
      <div className="pointer-events-none absolute inset-0 bg-[#F5F5F0]/65" />
      {/* 上下轻微过渡，让画面自然地融进纸面 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F5F5F0]/45 via-transparent to-[#F5F5F0]/80" />
    </div>
  )
}

/* ============================================================
   高级动态按钮：磁性吸附（鼠标靠近时轻微跟随）+ 点击波纹 + 流光
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
  // 点阵网格 pattern 唯一 id（同一页面可能渲染多个玻璃按钮）
  const patternId = useRef(`dotted-${Math.random().toString(36).slice(2, 9)}`).current
  const [ripples, setRipples] = useState<
    { x: number; y: number; id: number }[]
  >([])
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  // rAF 节流：鼠标移动时每帧最多更新一次，避免高频 setState
  const rafRef = useRef(0)

  // 磁性：鼠标在按钮内移动时，按钮朝鼠标方向轻微位移
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

  // 波纹：从点击位置扩散
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

  const base =
    'btn-shine relative overflow-hidden rounded-full px-7 py-3 text-sm font-medium'
  const solid = 'btn-aurora text-[#F5F5F0] hover:brightness-110'
  const outline =
    'border border-[#4A4A4A]/20 text-[#4a4a4a]/80 hover:border-[#B89663] hover:bg-[#B89663]/10 hover:text-[#2b2b2b] hover:shadow-[0_8px_30px_rgba(184,150,99,0.3)]'

  // 悬浮光晕：按变体给出不同强度的墨色/赭石光
  const glow =
    hovered && variant === 'solid'
      ? '0 0 0 1px rgba(184,150,99,0.5), 0 10px 44px rgba(74,74,74,0.28), inset 0 1px 0 rgba(255,255,255,0.3)'
      : hovered && variant === 'outline'
        ? '0 0 0 1px rgba(184,150,99,0.6), 0 10px 44px rgba(184,150,99,0.25)'
        : undefined

  // 玻璃流光按钮：与"查看作品"（CapabilityHeader）同款，保留链接跳转
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
        boxShadow: glow,
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
            background:
              variant === 'outline' ? 'rgba(184,150,99,0.5)' : undefined,
          }}
        />
      ))}
    </a>
  )
}

/* ============================================================ */
function Navbar() {
  const [open, setOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  // 滚动超过首屏后：固定顶栏切换为磨砂玻璃质感
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    // 只有跨过阈值时才更新，避免滚动时每像素触发重渲染
    const onScroll = () => {
      const next = window.scrollY > 80
      setScrolled((prev) => (prev === next ? prev : next))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  // 入场：导航栏从上方滑入
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
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? 'border-black/10 bg-white/75 backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1700px] items-center justify-between px-6 md:px-10">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-mono-num text-sm tracking-[0.3em] text-[#5F6F7E]">
            ZGH
          </span>
          <span className="text-sm text-[#4f4f4f]/80">· 个人简历</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[#4f4f4f]/80 transition-colors hover:text-[#2b2b2b]"
            >
              {l.label}
            </a>
          ))}
          <DynamicButton
            href="#contact"
            variant="outline"
            className="!border-[#B89663]/40 !px-5 !py-1.5 !text-[#5F6F7E]"
          >
            联系我
          </DynamicButton>
        </nav>

        {/* 移动端菜单按钮 */}
        <button
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="菜单"
        >
          <span
            className={`h-px w-5 bg-black/70 transition-transform ${open ? 'translate-y-[3.5px] rotate-45' : ''}`}
          />
          <span
            className={`h-px w-5 bg-black/70 transition-transform ${open ? '-translate-y-[3px] -rotate-45' : ''}`}
          />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 border-t border-black/8 bg-white/95 px-6 py-5 md:hidden">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-base text-[#2b2b2b]/70"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="text-base text-[#5F6F7E]"
          >
            联系我
          </a>
        </nav>
      )}
    </header>
  )
}

/* ============================================================ */
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

  // 入场时间线：遮罩揭开 → 视频淡入 → 其余内容依次浮现（标题由 MaskedHeading 自带 rise 动画）
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
      .fromTo(
        tagRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        '-=0.8',
      )
      .fromTo(
        subRef.current,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        '-=0.4',
      )
      .fromTo(
        descRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        '-=0.35',
      )
      .fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.3',
      )
      .fromTo(
        hintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        '-=0.2',
      )

    // 滚动视差：首屏滚出时，视频缓慢下移、内容上移淡出、滚动提示隐去
    const hero = heroRef.current
    if (hero) {
      gsap.to(videoWrapRef.current, {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      gsap.to(contentRef.current, {
        y: -90,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      gsap.to(hintRef.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <div ref={videoWrapRef} className="absolute inset-0 opacity-0">
        <HeroBg />
      </div>
      {/* 入场遮罩：页面加载时从中间向上下揭开 */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-30 bg-[#F5F5F0]"
      />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-[1700px] px-6 md:px-10"
      >
        <p
          ref={tagRef}
          className="font-mono-num mb-6 text-xs tracking-[0.4em] text-[#B89663]"
        >
          PORTFOLIO — 2026
        </p>
        {/* === 替换开始 === */}
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
          className="text-6xl sm:text-7xl lg:text-8xl"
        />
        <p
          ref={subRef}
          className="mt-4 text-xl font-medium tracking-wide text-gray-500 md:text-2xl"
        >
          能源与动力工程 · 准大一 · 热爱设计与 AI
        </p>
        <p
          ref={descRef}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400"
        >
          即将进入天津商业大学能源与动力工程专业的准大一新生。热爱设计与AI，正在学习用科技与审美表达想法。
        </p>
        {/* === 替换结束 === */}

        <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
          <DynamicButton href="#work" variant="glass" onClick={onCta}>查看项目</DynamicButton>
          <DynamicButton href="#contact" variant="outline" onClick={onCta}>联系我</DynamicButton>
        </div>
      </div>

      {/* 滚动提示 */}
      <div
        ref={hintRef}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="h-10 w-5 rounded-full border border-black/15">
          <div className="mx-auto mt-1.5 h-2 w-px bg-[#5F6F7E]/70" />
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   巨型水印标题：超大淡色英文背景字，随滚动左右滑入
   （ABOUT / SKILLS 居右从左滑入，WORK 居左从右滑入，交替成节奏）
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

  // 水印随滚动横向视差移动：滚动时持续位移，形成明显的动态背景层
  // 终点停在 x=0（贴边），保证大号水印文字始终完整在视口内、不被左右界限裁切
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const tween = gsap.fromTo(
      el,
      { x: dir * 220, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [dir])

  return (
    <h2
      ref={ref}
      className={`pointer-events-none absolute -top-3 select-none text-[clamp(3.5rem,10vw,9rem)] font-bold leading-none tracking-tight text-[#2b2b2b]/6 ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      {text}
    </h2>
  )
}

/* 通用滚动揭示：元素进入视口时上移淡入 */
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
        y: 0,
        opacity: 1,
        duration: 0.9,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [y, delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/* ============================================================ */
function SectionHeading({
  index,
  title,
  sub,
}: {
  index: string
  title: string
  sub?: string
}) {
  return (
    <div className="mb-12 md:mb-16">
      <p className="font-mono-num mb-3 text-xs tracking-[0.35em] text-[#5F6F7E]/70">
        {index}
      </p>
      <h2 className="title-glow title-sweep text-3xl font-semibold tracking-tight text-[#2b2b2b] md:text-5xl">
        {title}
      </h2>
      {sub && <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#4f4f4f]/70 md:text-base">{sub}</p>}
    </div>
  )
}

/* ============================================================ */
function About() {
  const sectionRef = useRef<HTMLElement>(null)

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

        {/* === 把这段替换成拍立得卡片 === */}
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
            className="relative h-[600px] w-full overflow-hidden rounded-[32px] bg-[#F8F7F4] shadow-inner"
          >
            <DraggableCardContainer className="relative flex h-full w-full items-center justify-center">

              {/* 1. 联系方式卡片 */}
              <DraggableCardBody className="absolute left-[5%] top-16 z-20 rotate-[-6deg]">
                <div className="w-[200px] rounded-sm bg-white p-4 pb-6 shadow-2xl transition-all hover:z-50">
                  <div className="mb-3 flex h-[140px] w-full items-center justify-center rounded-sm bg-gradient-to-br from-blue-50 to-indigo-100 text-2xl text-gray-400">📞</div>
                  <h4 className="text-center text-base font-bold text-black">联系方式</h4>
                  <p className="mt-1 whitespace-pre-line text-center text-[10px] leading-relaxed text-gray-500">电话 19816791893{'\n'}邮箱 2722281439@qq.com{'\n'}籍贯 贵州</p>
                </div>
              </DraggableCardBody>

              {/* 2. 天津商业大学 */}
              <DraggableCardBody className="absolute left-[42%] top-10 z-10 rotate-[4deg]">
                <div className="w-[200px] rounded-sm bg-white p-4 pb-6 shadow-2xl transition-all hover:z-50">
                  <div className="mb-3 flex h-[140px] w-full items-center justify-center rounded-sm bg-gradient-to-br from-emerald-50 to-green-100 text-2xl text-gray-400">🎓</div>
                  <h4 className="text-center text-base font-bold text-black">天津商业大学</h4>
                  <p className="mt-1 whitespace-pre-line text-center text-[10px] leading-relaxed text-gray-500">能源与动力工程 · 本科{'\n'}2026.09 – 2030.06</p>
                </div>
              </DraggableCardBody>

              {/* 3. 贵州省实验高级中学 */}
              <DraggableCardBody className="absolute bottom-20 left-[28%] z-30 rotate-[-8deg]">
                <div className="w-[200px] rounded-sm bg-white p-4 pb-6 shadow-2xl transition-all hover:z-50">
                  <div className="mb-3 flex h-[140px] w-full items-center justify-center rounded-sm bg-gradient-to-br from-orange-50 to-amber-100 text-2xl text-gray-400">🏫</div>
                  <h4 className="text-center text-base font-bold text-black">贵州省实验高级中学</h4>
                  <p className="mt-1 whitespace-pre-line text-center text-[10px] leading-relaxed text-gray-500">高中 · 年级排名前100{'\n'}2023.09 – 2026.06</p>
                </div>
              </DraggableCardBody>

              {/* 4. 班级学习委员 */}
              <DraggableCardBody className="absolute right-[15%] top-28 z-10 rotate-[12deg]">
                <div className="w-[200px] rounded-sm bg-white p-4 pb-6 shadow-2xl transition-all hover:z-50">
                  <div className="mb-3 flex h-[140px] w-full items-center justify-center rounded-sm bg-gradient-to-br from-pink-50 to-rose-100 text-2xl text-gray-400">📝</div>
                  <h4 className="text-center text-base font-bold text-black">班级学习委员</h4>
                  <p className="mt-1 whitespace-pre-line text-center text-[10px] leading-relaxed text-gray-500">作业反馈与统计{'\n'}组织班级学习小组</p>
                </div>
              </DraggableCardBody>

              {/* 5. 篮球社团成员 */}
              <DraggableCardBody className="absolute bottom-24 right-[35%] z-20 rotate-[-3deg]">
                <div className="w-[200px] rounded-sm bg-white p-4 pb-6 shadow-2xl transition-all hover:z-50">
                  <div className="mb-3 flex h-[140px] w-full items-center justify-center rounded-sm bg-gradient-to-br from-cyan-50 to-teal-100 text-2xl text-gray-400">🏀</div>
                  <h4 className="text-center text-base font-bold text-black">篮球社团成员</h4>
                  <p className="mt-1 whitespace-pre-line text-center text-[10px] leading-relaxed text-gray-500">参与团队对抗赛{'\n'}承担新人带练角色</p>
                </div>
              </DraggableCardBody>

              {/* 氛围背景字 */}
              <p className="pointer-events-none absolute left-1/2 top-1/2 z-0 max-w-xs -translate-x-1/2 -translate-y-1/2 select-none text-center text-3xl font-extrabold text-neutral-200/50">ABOUT</p>

            </DraggableCardContainer>
          </BorderGlow>
        </div>
        {/* === 替换区域结束 === */}
      </div>
    </section>
  )
}

/* ============================================================ */
function Work() {
  const sectionRef = useRef<HTMLElement>(null)

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

        {/* 精选作品：WebGL 液态变形轮播（melt 过渡，可拖拽/按键/点击切换） */}
        <div className="relative mt-14 h-[480px] w-full overflow-hidden rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:h-[560px]">
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
        </div>
      </div>
    </section>
  )
}

/* ============================================================ */
function Strengths() {
  return (
    <section id="strengths" className="relative py-24 md:py-36">
      <div className="neon-line pointer-events-none absolute inset-x-0 top-0" />
      <div className="relative mx-auto w-full max-w-[1700px] px-6 md:px-10">
        <Watermark text="SKILLS" align="right" dir={-1} />
        <CapabilityHeader />

        {/* 能力卡片网格：6 项核心能力 */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STRENGTHS.map((s) => (
            <div
              key={s.title}
              className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white/85 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c084fc]/40 hover:shadow-[0_16px_40px_rgba(192,132,252,0.16)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c084fc] to-[#38bdf8] text-2xl text-white shadow-lg shadow-[#c084fc]/30 transition-transform duration-300 group-hover:scale-110">
                  {s.icon}
                </div>
                <span className="font-mono-num text-sm font-bold text-[#c084fc]">{s.level}%</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#2b2b2b]">{s.title}</h3>
              <p className="mt-2 min-h-[3.75rem] text-sm leading-relaxed text-[#4f4f4f]/75">{s.desc}</p>
              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[#eeece4]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#c084fc] to-[#38bdf8] transition-all duration-700"
                  style={{ width: `${s.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================ */
function Contact() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 底部光晕：随滚动上移淡入（视差感）
      const glow = sectionRef.current?.querySelector('.contact-glow')
      if (glow) {
        gsap.fromTo(
          glow,
          { y: 140, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.4,
            ease: 'power3.out',
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
      <div className="contact-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(184,150,99,0.16),transparent_60%),radial-gradient(circle_at_90%_15%,rgba(95,111,126,0.1),transparent_55%)]" />
      <div className="relative mx-auto w-full max-w-[1700px] px-6 md:px-10">
        <Reveal>
          <p className="font-mono-num mb-6 text-xs tracking-[0.35em] text-[#5F6F7E]/70">
            04 / 联系
          </p>
          <h2 className="title-glow max-w-4xl text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[1.08] tracking-tight text-[#2b2b2b]">
            一起，把想法
            <span className="text-[#5F6F7E]">变成作品</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-[#4f4f4f]/75">
            设计与 AI 是我的兴趣方向。无论是校园项目、社团活动，
            还是学习上的交流，欢迎随时联系。
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-14 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <a
                href="mailto:2722281439@qq.com"
                className="group block border-b border-black/10 pb-3 transition-colors hover:border-[#B89663]/60"
              >
                <span className="text-xs text-[#4a4a4a]/45">邮箱</span>
                <span className="mt-1 block text-lg text-[#2b2b2b]/80 transition-colors group-hover:text-[#B89663] md:text-2xl">
                  2722281439@qq.com
                </span>
              </a>
              <div className="border-b border-black/10 pb-3">
                <span className="text-xs text-[#4a4a4a]/45">电话</span>
                <span className="mt-1 block font-mono-num text-lg text-[#2b2b2b]/80 md:text-2xl">
                  198 1679 1893
                </span>
              </div>
              <div className="border-b border-black/10 pb-3">
                <span className="text-xs text-[#4a4a4a]/45">基地</span>
                <span className="mt-1 block text-lg text-[#2b2b2b]/80 md:text-2xl">
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
          <div className="mt-24 flex flex-col gap-3 border-t border-black/8 pt-8 text-xs text-[#4a4a4a]/45 md:flex-row md:items-center md:justify-between">
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

/* ============================================================ */
export default function App() {
  // 求职彩蛋区块门控：滚动接近页面末尾时才挂载（按需加载 three.js chunk）
  const modelGateRef = useRef<HTMLDivElement>(null)
  const [showModel, setShowModel] = useState(false)

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
      { rootMargin: '700px 0px' }, // 提前 700px 预加载，滚到附近即无缝切换
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // 全局滚动进度条：页面顶部 3px 墨色→黛蓝→赭石渐变，随滚动填充
  useEffect(() => {
    const bar = document.createElement('div')
    bar.className =
      'fixed inset-x-0 top-0 z-[60] h-1 origin-left scale-x-0 bg-gradient-to-r from-[#4A4A4A] via-[#5F6F7E] to-[#B89663]'
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
    <>
      <main className="relative z-10 min-h-screen text-[#3a3a3a]">
        <Navbar />
        <Hero />
        <About />
        <Work />
        <Strengths />
        <Contact />
        {/* 占位保持页面高度；滚动接近末尾时挂载求职彩蛋（按需加载） */}
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
    </>
  )
}
