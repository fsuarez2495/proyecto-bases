"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import type { RegisterCredentials } from "@/types/database"

type Pais = {
  id_pais: number
  nombre: string
}

export function RegisterForm() {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    nombre: "",
    apellido: "",
    correo_electronico: "",
    contrasena: "",
    id_pais: 0, 
  })
  const [error, setError] = useState("")
  const [paises, setPaises] = useState<Pais[]>([])
  const [loadingPaises, setLoadingPaises] = useState(true)
  const { register, loading } = useAuth()

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        setLoadingPaises(true)
        const res = await fetch("http://localhost:8000/paises") 
        if (!res.ok) throw new Error(`Error al cargar países: ${res.status}`)
        const data: Pais[] = await res.json()
        setPaises(data)
      } catch (err: any) {
        console.error(err)
        setError("No se pudieron cargar los países. Intenta recargar la página.")
      } finally {
        setLoadingPaises(false)
      }
    }

    fetchPaises()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!credentials.nombre || !credentials.apellido || !credentials.correo_electronico || !credentials.contrasena || !credentials.id_pais) {
      setError("Por favor, completa todos los campos")
      return
    }

    const success = await register(credentials)
    if (!success) {
      setError("Error al crear la cuenta. Intenta de nuevo.")
    }
  }

  const handleInputChange = (field: keyof RegisterCredentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

 const handleSelectChange = (value: string) => {
  setCredentials((prev) => ({
    ...prev,
    id_pais: Number(value), // <-- convierte a number
  }))
}


//Fetch registro 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Crear Cuenta</CardTitle>
          <CardDescription className="text-gray-600">Regístrate para usar tu Drive personal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Juan"
                value={credentials.nombre}
                onChange={handleInputChange("nombre")}
                required
              />
            </div>

             <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                type="text"
                placeholder="Pérez"
                value={credentials.apellido}
                onChange={handleInputChange("apellido")}
                required
              />

            </div>
            <div className="space-y-2">
              <Label htmlFor="correo_electrnico">Correo electrónico</Label>
              <Input
                id="correo_electrnico"
                type="email"
                placeholder="tu@ejemplo.com"
                value={credentials.correo_electronico}
                onChange={handleInputChange("correo_electronico")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contrasena">Contraseña</Label>
              <Input
                id="contrasena"
                type="password"
                placeholder="••••••••"
                value={credentials.contrasena}
                onChange={handleInputChange("contrasena")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>País</Label>
              <Select onValueChange={handleSelectChange} disabled={loadingPaises}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingPaises ? "Cargando países..." : "Selecciona tu país"} />
                </SelectTrigger>
                <SelectContent>
                  {paises.map((p) => (
                    <SelectItem key={p.id_pais} value={p.id_pais.toString()}>
                      {p.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? "Creando cuenta..." : "Registrarse"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
