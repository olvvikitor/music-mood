"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Finaliza a barra sempre que a URL mudar
    NProgress.done();
  }, [pathname, searchParams]);

  // Remova o useEffect que dava NProgress.start() sozinho aqui!
  return null;
}