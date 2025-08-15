"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { Compartido, TipoAcceso, Usuario } from "@/types/database"

interface SharingContextType {
  sharedItems: Compartido[]
  accessTypes: TipoAcceso[]
  users: Usuario[]
  loading: boolean
  shareItem: (itemId: number, itemType: "file" | "folder", userEmail: string, accessTypeId: number) => Promise<boolean>
  updateAccess: (shareId: number, newAccessTypeId: number) => Promise<void>
  removeAccess: (shareId: number) => Promise<void>
  getSharedUsers: (itemId: number, itemType: "file" | "folder") => Compartido[]
  getSharedWithMe: () => Compartido[]
  searchUsers: (query: string) => Usuario[]
}

const SharingContext = createContext<SharingContextType | undefined>(undefined)

// Datos mock para tipos de acceso
const mockAccessTypes: TipoAcceso[] = [
  {
    id: 1,
    nombre: "Visualizador",
    descripcion: "Puede ver y descargar",
  },
  {
    id: 2,
    nombre: "Comentarista",
    descripcion: "Puede ver, descargar y comentar",
  },
  {
    id: 3,
    nombre: "Editor",
    descripcion: "Puede ver, descargar, comentar y editar",
  },
]

// Datos mock para usuarios
const mockUsers: Usuario[] = [
  {
    id: 1,
    email: "usuario@ejemplo.com",
    nombre: "Juan",
    apellido: "Pérez",
    password_hash: "",
    fecha_creacion: new Date(),
    ultimo_acceso: new Date(),
    activo: true,
    pais_id: 1,
    almacenamiento_id: 1,
  },
  {
    id: 2,
    email: "maria.garcia@ejemplo.com",
    nombre: "María",
    apellido: "García",
    password_hash: "",
    fecha_creacion: new Date(),
    ultimo_acceso: new Date(),
    activo: true,
    pais_id: 1,
    almacenamiento_id: 2,
  },
  {
    id: 3,
    email: "carlos.lopez@ejemplo.com",
    nombre: "Carlos",
    apellido: "López",
    password_hash: "",
    fecha_creacion: new Date(),
    ultimo_acceso: new Date(),
    activo: true,
    pais_id: 1,
    almacenamiento_id: 3,
  },
  {
    id: 4,
    email: "ana.martinez@ejemplo.com",
    nombre: "Ana",
    apellido: "Martínez",
    password_hash: "",
    fecha_creacion: new Date(),
    ultimo_acceso: new Date(),
    activo: true,
    pais_id: 1,
    almacenamiento_id: 4,
  },
]

// Datos mock para elementos compartidos
const initialSharedItems: Compartido[] = [
  {
    id: 1,
    archivo_id: 1,
    usuario_propietario_id: 1,
    usuario_compartido_id: 2,
    tipo_acceso_id: 2,
    fecha_compartido: new Date("2024-01-15"),
    activo: true,
  },
  {
    id: 2,
    carpeta_id: 1,
    usuario_propietario_id: 1,
    usuario_compartido_id: 3,
    tipo_acceso_id: 1,
    fecha_compartido: new Date("2024-01-18"),
    activo: true,
  },
]

export function SharingProvider({ children }: { children: React.ReactNode }) {
  const [sharedItems, setSharedItems] = useState<Compartido[]>(initialSharedItems)
  const [loading, setLoading] = useState(false)

  const shareItem = useCallback(
    async (itemId: number, itemType: "file" | "folder", userEmail: string, accessTypeId: number): Promise<boolean> => {
      setLoading(true)
      try {
        // Buscar usuario por email
        const user = mockUsers.find((u) => u.email === userEmail)
        if (!user) {
          setLoading(false)
          return false
        }

        // Verificar si ya está compartido
        const existingShare = sharedItems.find(
          (item) =>
            ((itemType === "file" && item.archivo_id === itemId) ||
              (itemType === "folder" && item.carpeta_id === itemId)) &&
            item.usuario_compartido_id === user.id,
        )

        if (existingShare) {
          setLoading(false)
          return false
        }

        // Simular llamada a API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newShare: Compartido = {
          id: Date.now(),
          archivo_id: itemType === "file" ? itemId : undefined,
          carpeta_id: itemType === "folder" ? itemId : undefined,
          usuario_propietario_id: 1, // Usuario actual
          usuario_compartido_id: user.id,
          tipo_acceso_id: accessTypeId,
          fecha_compartido: new Date(),
          activo: true,
        }

        setSharedItems((prev) => [...prev, newShare])
        setLoading(false)
        return true
      } catch (error) {
        setLoading(false)
        return false
      }
    },
    [sharedItems],
  )

  const updateAccess = useCallback(async (shareId: number, newAccessTypeId: number) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSharedItems((prev) =>
        prev.map((item) => (item.id === shareId ? { ...item, tipo_acceso_id: newAccessTypeId } : item)),
      )
    } finally {
      setLoading(false)
    }
  }, [])

  const removeAccess = useCallback(async (shareId: number) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSharedItems((prev) => prev.filter((item) => item.id !== shareId))
    } finally {
      setLoading(false)
    }
  }, [])

  const getSharedUsers = useCallback(
    (itemId: number, itemType: "file" | "folder") => {
      return sharedItems.filter((item) =>
        itemType === "file" ? item.archivo_id === itemId : item.carpeta_id === itemId,
      )
    },
    [sharedItems],
  )

  const getSharedWithMe = useCallback(() => {
    // En una implementación real, filtrarías por el usuario actual
    return sharedItems.filter((item) => item.usuario_compartido_id === 1)
  }, [sharedItems])

  const searchUsers = useCallback((query: string) => {
    if (!query.trim()) return []
    const lowercaseQuery = query.toLowerCase()
    return mockUsers.filter(
      (user) =>
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.nombre.toLowerCase().includes(lowercaseQuery) ||
        user.apellido.toLowerCase().includes(lowercaseQuery),
    )
  }, [])

  return (
    <SharingContext.Provider
      value={{
        sharedItems,
        accessTypes: mockAccessTypes,
        users: mockUsers,
        loading,
        shareItem,
        updateAccess,
        removeAccess,
        getSharedUsers,
        getSharedWithMe,
        searchUsers,
      }}
    >
      {children}
    </SharingContext.Provider>
  )
}

export function useSharing() {
  const context = useContext(SharingContext)
  if (context === undefined) {
    throw new Error("useSharing must be used within a SharingProvider")
  }
  return context
}
