"use client"
import { Bell, UserCircle, Activity } from 'lucide-react'
import RecentSongs from './components/RecentsSongs'
import Profile from './components/Profile'
import { Header } from './components/Header'

export default function Dashboard() {

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col gap-6 h-screen">

      {/* HEADER */}
      <header className="flex justify-end items-center py-2">
        <Header></Header>
      </header>

      {/* GRID PRINCIPAL */}
      <main className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 pb-6">

        {/* COLUNA ESQUERDA - Perfil (Ocupa 4 colunas) */}
        <div className="md:col-span-4 glass-card p-6 flex flex-col items-center justify-center text-center gap-4">
          <Profile></Profile>
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