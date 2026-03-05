'use client'; // Essencial: Interação com localStorage só funciona no cliente

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthSuccessPage() {


  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Autenticando... Por favor, aguarde.</p>
    </div>
  );
}