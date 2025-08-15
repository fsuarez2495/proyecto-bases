"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
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
    // Simular verificación de token almacenado
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        // En una implementación real, verificarías el token con el backend
        // Por ahora simulamos un usuario autenticado
        const mockUser: AuthUser = {
          id: 1,
          email: "usuario@ejemplo.com",
          nombre: "Juan",
          apellido: "Pérez",
          pais: { id: 1, nombre: "México", codigo: "MX" },
          almacenamiento: {
            id: 1,
            usuario_id: 1,
            espacio_total: 15000000000, // 15GB
            espacio_usado: 2500000000, // 2.5GB
            fecha_actualizacion: new Date(),
          },
        }
        setUser(mockUser)
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true)
    try {
      // Simular llamada a API de Oracle
      // En implementación real: const response = await fetch('/api/auth/login', { ... })

      // Simulación de validación
      if (credentials.email && credentials.password) {
        const mockUser: AuthUser = {
          id: 1,
          email: credentials.email,
          nombre: "Juan",
          apellido: "Pérez",
          pais: { id: 1, nombre: "México", codigo: "MX" },
          almacenamiento: {
            id: 1,
            usuario_id: 1,
            espacio_total: 15000000000,
            espacio_usado: 2500000000,
            fecha_actualizacion: new Date(),
          },
        }

        setUser(mockUser)
        localStorage.setItem("auth_token", "mock_jwt_token")
        setLoading(false)
        return true
      }

      setLoading(false)
      return false
    } catch (error) {
      setLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_token")
  }


const register = async (credentials: RegisterCredentials): Promise<boolean> => {
  setLoading(true)
  try {
    // Aquí va la lógica real de registro (llamada a tu API)
    // Simulación:
    if (credentials.correo_electronico && credentials.contrasena) {
      setLoading(false)
      return true
    }
    setLoading(false)
    return false
  } catch (error) {
    setLoading(false)
    return false
  }
}

  return <AuthContext.Provider value={{ user, login, logout, register, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
