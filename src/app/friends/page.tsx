"use client";

import { AppBrand } from "@/shared/components/AppBrand";
import { FriendsView } from "@/shared/components/FriendsView";
import Link from "next/link";

export default function FriendsPage() {
    return (
        <div className="min-h-screen text-white/90 antialiased" style={{ fontFamily: "var(--font-body)" }}>

            {/* Background blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
                    style={{ background: "radial-gradient(circle, #00ffb3, transparent 70%)" }} />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.04]"
                    style={{ background: "radial-gradient(circle, #ff2d87, transparent 70%)" }} />
            </div>

            <header className="sticky top-0 z-50 flex justify-between items-center px-5 md:px-8 py-3.5"
                style={{ background: "rgba(7,7,12,0.75)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <AppBrand className="text-xl" />
                <Link href="/dashboard" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                    ← Dashboard
                </Link>
            </header>

            <main className="max-w-[600px] mx-auto px-4 md:px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
                        Amigos
                    </h1>
                    <p className="text-sm text-white/40 mt-1">Veja o que seus amigos estão ouvindo.</p>
                </div>
                <FriendsView />
            </main>
        </div>
    );
}
