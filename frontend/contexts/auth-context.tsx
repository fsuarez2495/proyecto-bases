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
        // Guardar usuario en contexto y localStorage
        const loggedUser: AuthUser = {
          id: 1,
          email: credentials.correo_electronico,
          nombre: "Maria",
          apellido: "Mejia",
          pais: { id: 1, nombre: "México", codigo: "MX" },
          almacenamiento: {
            id: 1,
            usuario_id: 1,
            espacio_total: 15000000000,
            espacio_usado: 2500000000,
            fecha_actualizacion: new Date(),
          },
        }
        setUser(loggedUser)
        localStorage.setItem("user", JSON.stringify(loggedUser))
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
