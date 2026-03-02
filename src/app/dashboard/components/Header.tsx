"use client"
import { UserCircle, Crown, ChevronDown } from "lucide-react"
import { useProfile } from "../hooks/useProfile"
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";

export function Header() {
    const { data, isError, isLoading } = useProfile()
    
    if (isLoading) return <LoadingComponent type="header" />;
    if (isError || !data) return <ErrorComponent type="header" />;
    
    return (
        <div className="group flex items-center gap-3 cursor-pointer p-1.5 pr-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 backdrop-blur-md">
            
            {/* AVATAR COM INDICADOR PRO */}
            <div className="relative">
                {data?.img_profile ? (
                    <img 
                        src={data.img_profile} 
                        className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/50 group-hover:border-emerald-500 transition-colors" 
                        alt="Profile"
                    />
                ) : (
                    <UserCircle className="w-9 h-9 text-slate-400" />
                )}
                {/* Badge de Ícone Pro (Coroa) sobre a imagem */}
                <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-[#050505]">
                    <Crown className="w-2.5 h-2.5 text-black" />
                </div>
            </div>

            {/* INFOS DO USUÁRIO */}
            <div className="flex flex-col items-start leading-tight">
                <span className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {data?.display_name || 'Usuário'}
                </span>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    PRO PLAN
                </span>
            </div>

            {/* SETA INDICADORA (Menu Dropdown Visual) */}
            <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
            
        </div>
    )
}