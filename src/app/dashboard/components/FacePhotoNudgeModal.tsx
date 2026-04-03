"use client";

import { useRef, useState } from "react";
import { Camera, Sparkles, X } from "lucide-react";
import { updateFacePhotoService } from "@/shared/services/updateFacePhotoService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface FacePhotoNudgeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FacePhotoNudgeModal({ isOpen, onClose }: FacePhotoNudgeModalProps) {
    const queryClient = useQueryClient();
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");

    const { mutateAsync: updateFacePhoto, isPending } = useMutation({
        mutationFn: updateFacePhotoService,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            onClose();
        },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { setError("Apenas JPEG, PNG ou WEBP."); return; }
        if (file.size > 5 * 1024 * 1024) { setError("Máximo 5MB."); return; }
        setError("");
        try { await updateFacePhoto(file); }
        catch { setError("Não foi possível enviar. Tente novamente."); }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
            style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(12px)" }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="relative w-full max-w-sm rounded-3xl overflow-hidden flex flex-col"
                style={{
                    background: "var(--surface-card)",
                    border: "1px solid var(--border-medium)",
                    animation: "nudgeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
                }}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90"
                    style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-subtle)" }}
                >
                    <X className="w-3.5 h-3.5" style={{ color: "var(--text-faint)" }} />
                </button>

                {/* Illustration area */}
                <div
                    className="relative flex items-center justify-center"
                    style={{ height: 160, background: "linear-gradient(135deg, rgba(111,174,155,0.08), rgba(138,123,184,0.08))" }}
                >
                    {/* Ambient ring */}
                    <div
                        className="absolute rounded-full"
                        style={{
                            width: 140, height: 140,
                            border: "1px solid rgba(111,174,155,0.15)",
                            animation: "ringPulse 2.4s ease-in-out infinite",
                        }}
                    />
                    <div
                        className="absolute rounded-full"
                        style={{
                            width: 100, height: 100,
                            border: "1px solid rgba(111,174,155,0.22)",
                            animation: "ringPulse 2s 0.4s ease-in-out infinite",
                        }}
                    />

                    {/* Center icon */}
                    <div
                        className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{
                            background: "rgba(111,174,155,0.1)",
                            border: "1px solid rgba(111,174,155,0.3)",
                        }}
                    >
                        <Camera className="w-7 h-7" style={{ color: "#6fae9b" }} />
                    </div>

                    {/* Sparkles floating */}
                    <Sparkles
                        className="absolute w-4 h-4"
                        style={{ top: 30, right: 60, color: "#8a7bb8", opacity: 0.6, animation: "sparkleFloat 3s ease-in-out infinite" }}
                    />
                    <Sparkles
                        className="absolute w-3 h-3"
                        style={{ bottom: 28, left: 64, color: "#6fae9b", opacity: 0.5, animation: "sparkleFloat 2.5s 0.8s ease-in-out infinite" }}
                    />
                </div>

                {/* Content */}
                <div className="px-6 py-5 flex flex-col gap-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-display)", color: "#6fae9b" }}>
                            Personalize seu mood
                        </p>
                        <h3 className="text-lg font-black leading-tight" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                            Adicione seu rosto às artes
                        </h3>
                        <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--text-muted)" }}>
                            Com uma foto sua, cada imagem gerada pelo MusicMood terá o seu rosto — tornando cada arte única e pessoal.
                        </p>
                    </div>

                    {/* Benefit pills */}
                    <div className="flex flex-wrap gap-2">
                        {["Artes únicas com você", "IA personalizada", "Mais expressivo"].map(b => (
                            <span
                                key={b}
                                className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                                style={{
                                    background: "rgba(111,174,155,0.08)",
                                    border: "1px solid rgba(111,174,155,0.2)",
                                    color: "#6fae9b",
                                    fontFamily: "var(--font-display)",
                                }}
                            >
                                {b}
                            </span>
                        ))}
                    </div>

                    {error && <p className="text-[11px] text-rose-400">{error}</p>}

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        <label
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl cursor-pointer transition-all active:scale-[0.98]"
                            style={{
                                background: isPending
                                    ? "var(--surface-card-alt)"
                                    : "linear-gradient(135deg, #6fae9b, #5f9d8c)",
                                color: isPending ? "var(--text-muted)" : "#07070c",
                                fontFamily: "var(--font-display)",
                                fontWeight: 800,
                                fontSize: "13px",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                opacity: isPending ? 0.7 : 1,
                            }}
                        >
                            {isPending ? (
                                <>
                                    <Sparkles className="w-4 h-4 animate-spin" />
                                    Processando...
                                </>
                            ) : (
                                <>
                                    <Camera className="w-4 h-4" />
                                    Adicionar minha foto
                                </>
                            )}
                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                className="hidden"
                                disabled={isPending}
                                onChange={e => { void handleFileChange(e); }}
                            />
                        </label>

                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-2xl text-[12px] font-semibold transition-all active:scale-[0.98]"
                            style={{
                                background: "transparent",
                                color: "var(--text-faint)",
                                fontFamily: "var(--font-display)",
                            }}
                        >
                            Agora não
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes nudgeSlideUp {
                    from { opacity: 0; transform: translateY(32px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes sparkleFloat {
                    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
                    50%       { transform: translateY(-8px) rotate(15deg); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
