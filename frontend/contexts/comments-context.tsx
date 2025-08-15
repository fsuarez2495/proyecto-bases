"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { Comentario } from "@/types/database"

interface CommentsContextType {
  comments: Comentario[]
  loading: boolean
  addComment: (archivoId: number, contenido: string) => Promise<void>
  deleteComment: (commentId: number) => Promise<void>
  getCommentsForFile: (archivoId: number) => Comentario[]
  refreshComments: (archivoId: number) => Promise<void>
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined)

// Datos mock para comentarios
const initialComments: Comentario[] = [
  {
    id: 1,
    archivo_id: 1,
    usuario_id: 2,
    contenido: "Este documento necesita algunas revisiones en la sección de conclusiones.",
    fecha_creacion: new Date("2024-01-16T10:30:00"),
    activo: true,
  },
  {
    id: 2,
    archivo_id: 1,
    usuario_id: 3,
    contenido: "Excelente trabajo en el análisis de datos. Los gráficos están muy claros.",
    fecha_creacion: new Date("2024-01-17T14:15:00"),
    activo: true,
  },
  {
    id: 3,
    archivo_id: 2,
    usuario_id: 2,
    contenido: "¿Podríamos agregar más detalles sobre el presupuesto del Q2?",
    fecha_creacion: new Date("2024-01-18T09:45:00"),
    activo: true,
  },
  {
    id: 4,
    archivo_id: 1,
    usuario_id: 1,
    contenido: "Gracias por los comentarios. Actualizaré la sección de conclusiones esta semana.",
    fecha_creacion: new Date("2024-01-19T11:20:00"),
    activo: true,
  },
]

export function CommentsProvider({ children }: { children: React.ReactNode }) {
  const [comments, setComments] = useState<Comentario[]>(initialComments)
  const [loading, setLoading] = useState(false)

  const addComment = useCallback(async (archivoId: number, contenido: string) => {
    if (!contenido.trim()) return

    setLoading(true)
    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newComment: Comentario = {
        id: Date.now(),
        archivo_id: archivoId,
        usuario_id: 1, // Usuario actual
        contenido: contenido.trim(),
        fecha_creacion: new Date(),
        activo: true,
      }

      setComments((prev) => [...prev, newComment])
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteComment = useCallback(async (commentId: number) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
    } finally {
      setLoading(false)
    }
  }, [])

  const getCommentsForFile = useCallback(
    (archivoId: number) => {
      return comments
        .filter((comment) => comment.archivo_id === archivoId && comment.activo)
        .sort((a, b) => new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime())
    },
    [comments],
  )

  const refreshComments = useCallback(async (archivoId: number) => {
    setLoading(true)
    try {
      // En una implementación real, recargarías los comentarios desde la API
      await new Promise((resolve) => setTimeout(resolve, 500))
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <CommentsContext.Provider
      value={{
        comments,
        loading,
        addComment,
        deleteComment,
        getCommentsForFile,
        refreshComments,
      }}
    >
      {children}
    </CommentsContext.Provider>
  )
}

export function useComments() {
  const context = useContext(CommentsContext)
  if (context === undefined) {
    throw new Error("useComments must be used within a CommentsProvider")
  }
  return context
}
