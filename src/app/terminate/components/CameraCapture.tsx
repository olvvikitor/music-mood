"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, Loader2, RotateCcw, X } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<"starting" | "ready" | "error">("starting");
  const [errorMsg, setErrorMsg] = useState("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async (mode: "user" | "environment") => {
    stopStream();
    setStatus("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("ready");
    } catch {
      setErrorMsg("Não foi possível acessar a câmera. Verifique as permissões.");
      setStatus("error");
    }
  }, [stopStream]);

  useEffect(() => {
    startCamera(facingMode);
    return () => stopStream();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const switchCamera = () => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    startCamera(next);
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const w = video.videoWidth || 640;
    const h = video.videoHeight || 640;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flip horizontally for user-facing camera so it looks like a mirror
    if (facingMode === "user") {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, w, h);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `camera_${Date.now()}.jpg`, { type: "image/jpeg" });
        onCapture(file);
        onClose();
      },
      "image/jpeg",
      0.9,
    );
  };

  const retry = () => startCamera(facingMode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
      <div className="relative w-full max-w-[420px] mx-4 rounded-2xl overflow-hidden"
        style={{ background: "var(--surface-solid)", border: "1px solid var(--border-strong)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <span className="text-[11px] uppercase tracking-widest font-700 text-white/50"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
            Tirar foto
          </span>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video / fallback */}
        <div className="relative aspect-square" style={{ background: "#0a0a10" }}>
          {status === "starting" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
          )}

          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <Camera className="w-10 h-10 text-white/15" />
              <p className="text-[12px] text-white/40" style={{ fontFamily: "var(--font-body)" }}>
                {errorMsg}
              </p>
              <button onClick={retry}
                className="px-4 py-2 rounded-lg text-[11px] font-700 uppercase tracking-wider transition-all"
                style={{
                  background: "linear-gradient(135deg, #6fae9b, #5f9d8c)",
                  color: "#07070c",
                  fontFamily: "var(--font-display)",
                }}>
                Tentar novamente
              </button>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ display: status === "ready" ? "block" : "none", transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 px-4 py-4">
          <button onClick={switchCamera}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-medium)" }}>
            <RotateCcw className="w-4 h-4 text-white/60" />
          </button>

          <button onClick={capture} disabled={status !== "ready"}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95 disabled:opacity-30"
            style={{
              background: "transparent",
              border: "3px solid #6fae9b",
              boxShadow: "0 0 20px rgba(111,174,155,0.3)",
            }}>
            <div className="w-12 h-12 rounded-full" style={{ background: "#6fae9b" }} />
          </button>

          <div className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
}
