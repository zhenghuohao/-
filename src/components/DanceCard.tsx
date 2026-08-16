import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ModelViewer from './ModelViewer'

gsap.registerPlugin(ScrollTrigger)

/* ============================================================
   06 / 求职彩蛋 · AI 简历（舞蹈版）
   浅色羊皮纸圆角卡片 + 粉色按钮 + 内嵌 3D 模型（复用 05 的查看器）。
   与 05 一起放在底部按需加载，three.js 不进首屏包。
   ============================================================ */
export default function DanceCard() {
  const sectionRef = useRef<HTMLElement>(null)

  // 卡片滚动进入视口时上移淡入
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dance-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="dance"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden py-24 md:py-32"
    >
      <div className="neon-line pointer-events-none absolute inset-x-0 top-0" />
      <div className="relative mx-auto w-full max-w-[1700px] px-6 md:px-10">
        <p className="font-mono-num mb-6 text-xs tracking-[0.35em] text-[#B89663]/85">
          06 / 彩蛋
        </p>
        <h2 className="title-glow max-w-4xl text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[1.08] tracking-tight text-[#2b2b2b]">
          求职<span className="text-[#5F6F7E]">彩蛋</span>
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-[#4a4a4a]/80">
          评审老师们辛苦啦——最后附赠一张不正经的求职卡。
        </p>

        {/* 浅色羊皮纸圆角卡片：AI 简历 · 努力营业版 */}
        <div className="dance-card mx-auto mt-14 max-w-2xl rounded-[10px] border border-black/10 bg-[#FDFBF4] p-5 text-center text-[#2b2b2b] shadow-[0_20px_60px_rgba(74,74,74,0.12)] md:p-8">
          <h3 className="text-xl font-bold tracking-tight md:text-2xl">
            💃 郑同学的AI简历 · 努力营业版
          </h3>

          <p className="mt-4 text-[18px] leading-relaxed">
            别的选手都在拼手艺，我只能逼我的AI替身出来跳个托街舞助助兴。
            <br />
            各位评委老师，看在我把AI都逼疯了的份上，能不能给个机会？
            <br />
            它负责搞笑，我负责干活！
          </p>

          {/* 3D 模型展示区：浅色容器，放大到与项目卡片图片相近的尺寸 */}
          <div className="mx-auto mt-6 w-full max-w-[460px]">
            <ModelViewer heightClass="h-[360px]" light zoom={1.35} />
          </div>

          <button
            type="button"
            onClick={() =>
              document
                .querySelector('#contact')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="mt-6 cursor-pointer rounded-[5px] bg-[#FF1493] px-5 py-2.5 font-bold text-white transition hover:brightness-110 active:scale-95"
          >
            ❤️ 选我！别逼我求你！我从早上跳到晚上，跳到天崩地裂海枯石烂！！！
          </button>

          <p className="mt-4 text-xs leading-relaxed text-[#888]">
            （注：本AI不会真跳舞，但会写代码/修坦克/调3D模型）
          </p>
        </div>
      </div>
    </section>
  )
}
