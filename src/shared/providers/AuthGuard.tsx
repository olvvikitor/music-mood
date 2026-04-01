"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

const PUBLIC_PATHS = new Set(["/login", "/terminate", "/auth-success"]);

export function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const isPublicRoute = useMemo(() => {
    if (!pathname) return true;
    for (const publicPath of PUBLIC_PATHS) {
      if (pathname === publicPath || pathname.startsWith(`${publicPath}/`)) {
        return true;
      }
    }
    return false;
  }, [pathname]);

  useEffect(() => {
    if (isPublicRoute) {
      setIsCheckingAuth(false);
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    setIsCheckingAuth(false);
  }, [isPublicRoute, router]);

  if (isCheckingAuth) {
    return null;
  }

  return <>{children}</>;
}
