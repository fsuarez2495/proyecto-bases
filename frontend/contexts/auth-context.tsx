"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { AuthUser, LoginCredentials, RegisterCredentials } from "@/types/database"

interface AuthContextType {
  user: AuthUser | null
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  register: (credentials: RegisterCredentials) => Promise<boolean>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true)
    try {

      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })
      const data = await res.json()
if (data.idToken) {
  // Obtener usuario real desde backend
 const resUsuario = await fetch(`http://127.0.0.1:8000/usuarios?correo=${encodeURIComponent(credentials.correo_electronico)}`)
  if (!resUsuario.ok) throw new Error("No se pudo obtener usuario")

  const usuarioData = await resUsuario.json()

  setUser(usuarioData)
  localStorage.setItem("user", JSON.stringify(usuarioData))
  setLoading(false)
  return true
}

      setLoading(false)
      return false
    } catch (err) {
      setLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

const register = async (credentials: RegisterCredentials): Promise<boolean> => {
  setLoading(true)
  try {
    const res = await fetch("http://127.0.0.1:8000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    if (res.ok) {
      // Registro exitoso
      setLoading(false)
      return true
    }

    setLoading(false)
    return false
  } catch (err) {
    console.error("Error registrando usuario:", err)
    setLoading(false)
    return false
  }
}


  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
