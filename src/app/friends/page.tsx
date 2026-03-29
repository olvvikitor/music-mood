"use client";

import { AppBrand } from "@/shared/components/AppBrand";
import { FriendsView } from "@/shared/components/FriendsView";
import Link from "next/link";

export default function FriendsPage() {
    return (
        <div className="min-h-screen antialiased" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full"
                    style={{ background: "radial-gradient(circle, var(--blob-1), transparent 70%)" }} />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full"
                    style={{ background: "radial-gradient(circle, var(--blob-2), transparent 70%)" }} />
            </div>

            <header
                className="sticky top-0 z-50 flex justify-between items-center px-5 md:px-8 py-3.5"
                style={{
                    background: "var(--header-bg)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid var(--border-subtle)",
                }}
            >
                <AppBrand className="text-xl" />
                <Link
                    href="/dashboard"
                    className="text-xs font-semibold transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"}
                >
                    ← Dashboard
                </Link>
            </header>

            <main className="max-w-[600px] mx-auto px-4 md:px-6 py-8">
                <div className="mb-6">
                    <h1
                        className="text-2xl font-black uppercase tracking-tight"
                        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                    >
                        Amigos
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                        Veja o que seus amigos estão ouvindo.
                    </p>
                </div>
                <FriendsView />
            </main>
        </div>
    );
}
