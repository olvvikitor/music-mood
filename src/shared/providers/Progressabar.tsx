"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";

export default function ProgressBar() {
  const pathname = usePathname();
  useEffect(() => {
    // Finaliza a barra sempre que a URL mudar
    NProgress.done();
  }, [pathname]);

  // Remova o useEffect que dava NProgress.start() sozinho aqui!
  return null;
}