import { UserCircle } from "lucide-react"
import { useProfile } from "../hooks/useProfile"
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";

export function Header() {

    const {data, isError, isLoading} = useProfile()
      if (isLoading) return <LoadingComponent type="header" />;
    
      if (isError || !data) return <ErrorComponent />;
    



    return (
        // No seu Header dentro do page.tsx (Dashboard)
        <div className="flex items-center gap-2 cursor-pointer p-1 pr-3 rounded-full hover:bg-white/10 transition glass-card">
            {data?.img_profile ? (
                <img src={data.img_profile} className="w-8 h-8 rounded-full object-cover" />
            ) : (
                <UserCircle className="w-8 h-8 text-blue-200" />
            )}
            <span className="text-sm font-medium">{data?.display_name || 'Usuário'}</span>
        </div>
    )
}