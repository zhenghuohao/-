import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/* ============================================================
   ModelViewer · GLB 动态模型展示
   - 自动旋转 + 鼠标拖拽/滚轮缩放（OrbitControls）
   - 支持模型内嵌动画（GLB animations，用 AnimationMixer 播放）
   - 自适应容器尺寸（ResizeObserver）
   - 加载失败容错：显示提示文案，不影响页面其他内容
   使用方法：
   1. 把 .glb 文件复制到 public/models/ 目录
   2. 把 MODEL_SRC 改成实际文件名（如 '/models/energy.glb'）
   3. 重新构建后模型随 dist 一起打包
   ============================================================ */
export const MODEL_SRC = '/models/3DWUDAO2.glb'

export default function ModelViewer({
  src = MODEL_SRC,
  heightClass = 'h-[440px]',
  light = false,
  zoom = 1,
}: {
  src?: string
  heightClass?: string
  light?: boolean
  /** 模型显示放大倍数：>1 放大（scale 增大 + 相机拉近），用于小容器里让模型更醒目 */
  zoom?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    /* ---------- 场景 / 相机 / 渲染器 ---------- */
    const width = el.clientWidth || 1
    const height = el.clientHeight || 1
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 1.6 / zoom, 4 / zoom)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)

    /* ---------- 灯光：氛围 + 主光，保证金属/玻璃材质可见 ---------- */
    scene.add(new THREE.HemisphereLight(0xa78bfa, 0x0a0a12, 1.6))
    const key = new THREE.DirectionalLight(0xffffff, 2.6)
    key.position.set(3, 5, 4)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x60a5fa, 1.3)
    rim.position.set(-3, 2, -3)
    scene.add(rim)

    /* ---------- 轨道控制器：自动旋转 + 拖拽/缩放 ---------- */
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.6
    controls.minDistance = 1.5
    controls.maxDistance = 8

    /* ---------- 加载 GLB（支持 Draco 压缩：解码器本地 /draco/） ---------- */
    let mixer: THREE.AnimationMixer | null = null
    const loader = new GLTFLoader()
    const draco = new DRACOLoader()
    draco.setDecoderPath('/draco/')
    loader.setDRACOLoader(draco)
    loader.load(
      src,
      (gltf) => {
        const model = gltf.scene
        // 自动缩放适配：把模型包进相机视野
        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3()).length()
        const center = box.getCenter(new THREE.Vector3())
        const scale = size > 0 ? (1.7 * zoom) / size : 1
        model.scale.setScalar(scale)
        model.position.sub(center.multiplyScalar(scale))
        scene.add(model)

        // 模型内嵌动画：自动播放第一个
        if (gltf.animations.length) {
          mixer = new THREE.AnimationMixer(model)
          mixer.clipAction(gltf.animations[0]).play()
        }
        setState('ok')
      },
      undefined,
      () => setState('error'),
    )

    /* ---------- 渲染循环 ---------- */
    const clock = new THREE.Clock()
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = clock.getDelta()
      mixer?.update(dt)
      controls.update()
      renderer.render(scene, camera)
    }
    tick()

    /* ---------- 容器尺寸自适应 ---------- */
    const resize = () => {
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(el)

    /* ---------- 清理 ---------- */
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      controls.dispose()
      mixer?.stopAllAction()
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose()
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => m?.dispose())
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
      draco.dispose()
    }
  }, [src])

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`relative w-full cursor-grab overflow-hidden rounded-2xl active:cursor-grabbing ${heightClass} ${light ? 'bg-[#F8F5EE]' : ''}`}
      >
        {/* 加载中 */}
        {state === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div
              className={`h-9 w-9 animate-spin rounded-full border-2 ${
                light
                  ? 'border-[#5F6F7E]/30 border-t-[#5F6F7E]'
                  : 'border-[#a78bfa]/30 border-t-[#a78bfa]'
              }`}
            />
            <span
              className={`text-sm ${light ? 'text-[#575757]/80' : 'text-[#e0e0e0]/60'}`}
            >
              正在加载 3D 模型…
            </span>
          </div>
        )}
        {/* 加载失败：提示模型文件路径 */}
        {state === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="text-3xl">🧊</span>
            <p className={`text-sm ${light ? 'text-[#575757]/80' : 'text-[#e0e0e0]/70'}`}>
              未找到模型文件{' '}
              <code
                className={`rounded px-1.5 py-0.5 ${
                  light ? 'bg-black/10 text-[#5F6F7E]' : 'bg-white/10 text-[#a78bfa]'
                }`}
              >
                {src}
              </code>
            </p>
            <p className={`text-xs ${light ? 'text-[#575757]/50' : 'text-[#e0e0e0]/40'}`}>
              请把 .glb 文件复制到{' '}
              <code className={light ? 'text-[#5F6F7E]/80' : 'text-[#a78bfa]/80'}>
                public/models/
              </code>{' '}
              并修改文件名后重新构建
            </p>
          </div>
        )}
      </div>
      <p className={`mt-3 text-center text-xs ${light ? 'text-[#575757]/50' : 'text-[#e0e0e0]/40'}`}>
        拖拽旋转 · 滚轮缩放 · 自动旋转
      </p>
    </div>
  )
}
