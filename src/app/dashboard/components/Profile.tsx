"use client"
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import { useProfile } from "../hooks/useProfile";
import { RotateCw, UserCircle, Sparkles } from 'lucide-react';
import { useMoodProfile } from "../hooks/useMoodProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRefreshProfile } from "../services/getRefreshProfileService";
import NProgress from "nprogress";

export default function Profile() {
  const { data: profile, isLoading: profileLoading, isError: profileError } = useProfile();
  const { data: mood, isLoading: moodLoading, isError: moodError } = useMoodProfile();
  const queryCliente = useQueryClient();

  const { mutate: refreshUser, isPending } = useMutation({
    mutationFn: getRefreshProfile,
    onMutate: () => { NProgress.start(); },
    onSuccess: async () => {
      await queryCliente.invalidateQueries({ queryKey: ['moodProfile'] });
    },
    onSettled: () => { NProgress.done(); }
  });

  if (profileLoading || moodLoading) return <LoadingComponent type="profile" />;
  if (moodError || profileError || !mood || !profile) return <ErrorComponent type="profile" />;

  return (
    /* Reduzido de p-10 para p-6 e gap-10 para gap-6 | h-fit garante que ele não estique sozinho */
    <div className="glass-card p-6 md:p-7 flex flex-col gap-6 relative overflow-hidden group h-fit shadow-2xl">

      {/* Efeito de brilho de fundo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[80px] rounded-full -mr-16 -mt-16" />

      {/* HEADER COMPACTO */}
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-emerald-500/20 p-0.5">
            <img src={profile.img_profile} className="w-full h-full rounded-full object-cover" alt="Avatar" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xs font-bold text-white/90 truncate max-w-[120px]">{profile.display_name}</h2>
            <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Premium</p>
          </div>
        </div>

        <button
          onClick={() => refreshUser()}
          className="p-2 rounded-lg border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all active:scale-95"
        >
          <RotateCw className={`w-3.5 h-3.5 text-emerald-500 ${isPending ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* SEÇÃO CENTRAL - Vertical e Equilibrada */}
      <div className="flex flex-col items-center gap-5 relative z-10">

        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <p className="text-[9px] uppercase font-black tracking-[0.2em]">Mood Atual</p>
          </div>
          <span className="text-2xl font-black italic tracking-tighter text-white uppercase group-hover:text-emerald-400 transition-colors duration-500">
            {mood.sentiment}
          </span>
        </div>

        {/* GIF - Tamanho médio e responsivo */}
        <div className="relative group/gif w-full flex justify-center">
          <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full scale-75 group-hover/gif:scale-95 transition-transform duration-700 opacity-50" />

          <div className="w-40 h-40 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-[2rem] overflow-hidden relative border border-white/10 shadow-xl transform transition-transform duration-500 group-hover/gif:-rotate-1">
            <img src={mood.url_gif} className="w-full h-full object-cover" alt="GIF de Humor" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* FOOTER - Minimalista */}
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[9px] uppercase font-bold tracking-widest text-slate-500">
        <span>Sincronizado</span>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </div>
  );
}