'use client';

// ⚠️ PÁGINA NÃO UTILIZADA — pode ser removida com segurança.
// O callback OAuth do Spotify/YouTube é tratado diretamente pelo backend
// e redireciona para /terminate?token=... sem passar por esta rota.

export default function AuthSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Autenticando... Por favor, aguarde.</p>
    </div>
  );
}
