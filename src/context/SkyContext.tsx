import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

/* ============================================================
   天空主题上下文
   管理当前天空阶段（sunset → afternoon → golden → twilight → night）
   并提供各阶段对应的配色方案
   ============================================================ */

export type SkyPhase = 'sunset' | 'afternoon' | 'golden' | 'twilight' | 'night'

interface SkyColors {
  textPrimary: string
  textSecondary: string
  textMuted: string
  cardBg: string
  cardBorder: string
}

interface SkyTheme {
  phase: SkyPhase
  colors: SkyColors
  setPhase: (phase: SkyPhase) => void
}

const PHASE_COLORS: Record<SkyPhase, SkyColors> = {
  sunset: {
    textPrimary: '#1a1a2e',
    textSecondary: 'rgba(30, 30, 50, 0.75)',
    textMuted: 'rgba(30, 30, 50, 0.5)',
    cardBg: 'rgba(255, 255, 255, 0.55)',
    cardBorder: 'rgba(0, 0, 0, 0.08)',
  },
  afternoon: {
    textPrimary: '#1a2a3a',
    textSecondary: 'rgba(26, 42, 58, 0.75)',
    textMuted: 'rgba(26, 42, 58, 0.5)',
    cardBg: 'rgba(255, 255, 255, 0.45)',
    cardBorder: 'rgba(0, 0, 0, 0.06)',
  },
  golden: {
    textPrimary: '#2a1f10',
    textSecondary: 'rgba(60, 45, 20, 0.75)',
    textMuted: 'rgba(60, 45, 20, 0.5)',
    cardBg: 'rgba(255, 240, 200, 0.4)',
    cardBorder: 'rgba(180, 140, 60, 0.12)',
  },
  twilight: {
    textPrimary: '#e8e0f0',
    textSecondary: 'rgba(220, 210, 240, 0.75)',
    textMuted: 'rgba(200, 190, 220, 0.5)',
    cardBg: 'rgba(30, 20, 60, 0.45)',
    cardBorder: 'rgba(123, 104, 238, 0.15)',
  },
  night: {
    textPrimary: '#e0e8f0',
    textSecondary: 'rgba(200, 215, 235, 0.75)',
    textMuted: 'rgba(170, 190, 215, 0.5)',
    cardBg: 'rgba(15, 20, 40, 0.55)',
    cardBorder: 'rgba(100, 140, 200, 0.15)',
  },
}

const SkyContext = createContext<SkyTheme>({
  phase: 'sunset',
  colors: PHASE_COLORS.sunset,
  setPhase: () => {},
})

export function useSkyTheme() {
  return useContext(SkyContext)
}

export function SkyProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<SkyPhase>('sunset')
  const setCurrentPhase = useCallback((newPhase: SkyPhase) => setPhase(newPhase), [])

  const colors = PHASE_COLORS[phase]

  return (
    <SkyContext.Provider value={{ phase, colors, setPhase: setCurrentPhase }}>
      {children}
    </SkyContext.Provider>
  )
}

export { PHASE_COLORS }
