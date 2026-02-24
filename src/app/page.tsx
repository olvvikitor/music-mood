"use client"
import { Bell, UserCircle, Activity } from 'lucide-react'
import RecentSongs from './modules/music/components/RecentsSongs'
import { useRecentMusics } from './modules/music/hooks/useRecentMusics'
import LoadingComponent from '@/shared/components/Loading'
import ErrorComponent from '@/shared/components/Error'

export default function Dashboard() {

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col gap-6 h-screen">

      {/* HEADER */}
      <header className="flex justify-between items-center py-2">
        <div className="flex items-center gap-2">
          <Activity className="w-8 h-8 text-blue-300" />
          <h1 className="text-2xl font-semibold tracking-tight text-white">Music Mood</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition">
            <Bell className="w-5 h-5 text-blue-100" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer p-1 pr-3 rounded-full hover:bg-white/10 transition glass-card">
            <UserCircle className="w-8 h-8 text-blue-200" />
            <span className="text-sm font-medium">Alex Silva</span>
          </div>
        </div>
      </header>

      {/* GRID PRINCIPAL */}
      <main className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 pb-6">

        {/* COLUNA ESQUERDA - Perfil (Ocupa 4 colunas) */}
        <div className="md:col-span-4 glass-card p-6 flex flex-col items-center justify-center text-center gap-4">
          {/* Aqui entrará o componente ProfileCard */}
          <div className="w-32 h-32 rounded-full bg-blue-300/30 mb-4 border-4 border-white/20"></div>
          <h2 className="text-xl font-bold">Alex Silva</h2>
          <p className="text-blue-200/80 text-sm">alex.silva@email.com</p>
          <span className="px-4 py-1 mt-2 text-xs font-semibold bg-blue-500/30 rounded-full border border-blue-400/30">
            Pro Plan
          </span>

          <div className="mt-8">
            <div className="text-6xl mb-4">😎</div>
            <p className="text-sm text-blue-100/90">Seu humor predominante hoje:</p>
            <p className="text-lg font-bold">Motivado</p>
          </div>
        </div>

        {/* COLUNA DIREITA - Gráficos e Dados (Ocupa 8 colunas) */}
        <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Últimas Músicas */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 text-lg">Últimas Músicas</h3>
            <RecentSongs/>
          </div>

          {/* Gráfico de Humor (Ocupa 2 colunas no mobile, 1 no grid interno) */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 text-lg">Gráfico da Semana</h3>
            {/* Aqui entrará o Recharts (LineChart) */}
          </div>

          {/* Distribuição de Emoções */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 text-lg">Distribuição de Emoções</h3>
            {/* Aqui entrará o Recharts (PieChart/Donut) */}
          </div>

          {/* Insights */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 text-lg">Insights Inteligentes</h3>
            {/* Aqui entrará a lista de insights */}
          </div>

        </div>
      </main>
    </div>
  )
}