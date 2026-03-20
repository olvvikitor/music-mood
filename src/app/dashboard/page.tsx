"use client"
import RecentSongs from './components/RecentsSongs'
import Profile from './components/Profile'
import { Header } from './components/Header'
import { Zap, Sparkles, Radio } from 'lucide-react'
import { EmotionalCardChart } from './components/EmotionalCardGraphicChart'
import { AppBrand } from '@/shared/components/AppBrand'
import { SectionCard } from '@/shared/components/SectionCard'
import { InsightsSection } from './components/InsightsSection'
import { NowPlayingCard } from './components/NowPlayingCard'

export default function Dashboard() {
  return (
    <div className="min-h-screen text-white/90 antialiased" style={{ fontFamily: "var(--font-body)" }}>

      {/* ── Ambient background blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #00ffb3, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #ff2d87, transparent 70%)" }} />
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full opacity-[0.025]"
          style={{ background: "radial-gradient(circle, #a259ff, transparent 70%)" }} />
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-5 md:px-8 py-3.5"
        style={{
          background: "rgba(7,7,12,0.75)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
        <AppBrand className="text-xl" />
        <Header />
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-[1380px] mx-auto px-4 md:px-8 py-6 md:py-8">

        {/* ── BENTO GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">

          {/* 1 — Coluna relevante: perfil + música atual */}
          <div className="col-span-1 md:col-span-12 lg:col-span-5 order-1">
            <div className="grid grid-cols-1 gap-4 md:gap-5 h-full">
              <div className="min-h-[300px]">
                <Profile />
              </div>

              <SectionCard
                title="Tocando Agora"
                icon={<Radio />}
                iconColor="text-brand-primary"
                accentColor="#00ffb3"
                className="min-h-[220px]"
                noPadding
              >
                <NowPlayingCard />
              </SectionCard>

              <div>
                <InsightsSection />
              </div>
            </div>
          </div>

          {/* 2 — Últimas faixas à direita no desktop */}
          <div className="col-span-1 md:col-span-12 lg:col-span-7 order-2">
            <SectionCard
              title="Últimas Faixas"
              icon={<Zap fill="currentColor" />}
              iconColor="text-brand-primary"
              accentColor="#00ffb3"
              className="h-full min-h-[560px]"
            >
              <RecentSongs compact />
            </SectionCard>
          </div>

          {/* 3 — Mix emocional */}
          <div className="col-span-1 md:col-span-12 lg:col-span-12 order-3">
            <SectionCard
              icon={<Sparkles />}
              title="Mix Emocional"
              iconColor="text-brand-secondary"
              accentColor="#ff2d87"
              className="h-full min-h-[380px]"
            >
              <EmotionalCardChart />
            </SectionCard>
          </div>

        </div>
      </main>
    </div>
  )
}
