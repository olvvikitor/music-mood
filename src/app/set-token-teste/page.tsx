"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
  const router = useRouter()
  const [user, setUser] = useState("")
  const [senha, setSenha] = useState("")

  const setToken = (name: string) => {
    if (name === 'victor') {
      localStorage.setItem(
        "auth_token",
        process.env.NEXT_PUBLIC_AUTH_TOKEN as string
      )
    }
    if (name === 'emyle') {
      localStorage.setItem(
        "auth_token",
        process.env.NEXT_PUBLIC_AUTH_TOKEN_EMYLE as string
      )

    }
    alert("Token salvo!")
    router.push("/dashboard")
  }

  const login = (e: React.FormEvent) => {
    e.preventDefault()

    if (user === "victor" && senha === "victor") {
      setToken('victor')
    } 
    if (user === "emyle" && senha === "emyle") {
      setToken('emyle')
    } 
    else {
      alert("Login inválido")
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <form onSubmit={login}>
        <input
          type="text"
          placeholder="Usuário"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Salvar Token
        </button>
      </form>
    </div>
  )
}