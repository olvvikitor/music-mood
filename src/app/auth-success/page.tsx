'use client'; // Essencial: Interação com localStorage só funciona no cliente

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // 1. Salva o token
      localStorage.setItem('auth_token', token);

      // 2. Redireciona para a dashboard
      router.push('/dashboard');
    } else {
      // Caso não haja token, manda de volta para o login
      router.push('/login');
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Autenticando... Por favor, aguarde.</p>
    </div>
  );
}