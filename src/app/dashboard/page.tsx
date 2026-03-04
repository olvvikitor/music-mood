"use client"
import RecentSongs from './components/RecentsSongs'
import Profile from './components/Profile'
import { Header } from './components/Header'
import { LayoutDashboard, LineChart, PieChart, Sparkles, Plus } from 'lucide-react'
import { EmotionalCardChart } from './components/EmotionalCardGraphicChart'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 selection:bg-emerald-500/30 font-sans antialiased">
      <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-10 flex flex-col gap-8 lg:gap-10">

        {/* HEADER */}
        <header className="flex justify-between items-center sticky top-0 py-4 z-50 bg-[#050505]/80 backdrop-blur-md">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
              <LayoutDashboard className="w-5 h-5 text-emerald-500" />
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter italic uppercase">
              Music<span className="text-emerald-500">Mood</span>
            </h1>
          </div>
          <Header />
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* COLUNA ESQUERDA - Profile + Espaço Futuro */}
          <aside className="lg:col-span-6 xl:col-span-4 flex flex-col gap-8 lg:sticky lg:top-28">
            <Profile />
            {/* DIV PARA DADO FUTURO (Abaixo do Perfil) */}
            <div className="glass-card p-6 border-dashed flex flex-col items-center justify-center min-h-[150px] group transition-all hover:bg-white/[0.03]">
              <EmotionalCardChart/>
            </div>
          </aside>

          {/* COLUNA DIREITA - Conteúdo Principal */}
          <section className="lg:col-span-6 xl:col-span-8 flex flex-col gap-8 lg:gap-10">

            {/* 1. MÚSICAS RECENTES (Ocupa todo o topo) */}
            <div className="w-full min-w-0">
              <RecentSongs />
            </div>

            {/* 2. GRÁFICOS LADO A LADO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-6 flex flex-col min-h-70">
                <div className="flex items-center gap-3 mb-6">
                  <LineChart className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-500">Evolução Semanal</h3>
                </div>
                <div className="flex-1 border-t border-white/5 pt-4 flex items-center justify-center italic text-slate-700 text-xs">
                  Aguardando dados...
                </div>
              </div>

              <div className="glass-card p-6 flex flex-col min-h-70">
                <div className="flex items-center gap-3 mb-6">
                  <PieChart className="w-4 h-4 text-purple-500" />
                  <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-500">Mix Emocional</h3>
                </div>
                <div className="flex-1 border-t border-white/5 pt-4 flex items-center justify-center italic text-slate-700 text-xs">
                  Aguardando dados...
                </div>
              </div>
            </div>

            {/* 3. INSIGHTS (Ocupa a largura total abaixo dos gráficos) */}
            <div className="glass-card p-8 md:p-10 relative overflow-hidden group">
              <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/3 blur-[120px] rounded-full pointer-events-none" />

              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-black text-xl tracking-tight">AI Insights</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Real-time Analysis</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all">
                  <p className="text-slate-300 leading-relaxed text-sm">
                    Sua tarde indica uma tendência <span className="text-emerald-400 font-bold">Contemplativa</span>. O foco aumentou em 22% com as últimas faixas.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-rose-500/30 transition-all">
                  <p className="text-slate-300 leading-relaxed text-sm">
                    Padrão de <span className="text-rose-400 font-bold">Alta Tensão</span> detectado. Que tal uma pausa com sons ambientes?
                  </p>
                </div>
              </div>
            </div>

          </section>
        </main>
      </div>
    </div>
  )
}