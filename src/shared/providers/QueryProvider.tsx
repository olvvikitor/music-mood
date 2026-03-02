"use client"
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ReactNode, useState } from "react"
import ProgressBar from "./Progressabar"

export function QueryProvider({ children }: { children: ReactNode }) {
    // Mantemos a instância segura dentro do componente
    const [queryClient] = useState(() => new QueryClient())
    return (
        <>
            <ProgressBar />
            <QueryClientProvider client={queryClient}>
                {children}
                {/* O DevTools fica aqui dentro, logo abaixo dos children */}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>

        </>
    )
}