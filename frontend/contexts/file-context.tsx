"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { Archivo, Carpeta } from "@/types/database"

interface FileContextType {
  files: Archivo[]
  folders: Carpeta[]
  currentFolderId: number | null
  currentPath: { id: number | null; name: string }[]
  loading: boolean
  uploadFile: (file: File, folderId?: number) => Promise<void>
  createFolder: (name: string, parentId?: number) => Promise<void>
  deleteFile: (fileId: number) => Promise<void>
  deleteFolder: (folderId: number) => Promise<void>
  renameFile: (fileId: number, newName: string) => Promise<void>
  renameFolder: (folderId: number, newName: string) => Promise<void>
  navigateToFolder: (folderId: number | null, folderName?: string) => void
  refreshFiles: () => Promise<void>
}

const FileContext = createContext<FileContextType | undefined>(undefined)

// Datos mock iniciales
const initialFolders: Carpeta[] = [
  {
    id: 1,
    nombre: "Documentos",
    usuario_id: 1,
    fecha_creacion: new Date("2024-01-15"),
    fecha_modificacion: new Date("2024-01-20"),
  },
  {
    id: 2,
    nombre: "Fotos",
    usuario_id: 1,
    fecha_creacion: new Date("2024-01-10"),
    fecha_modificacion: new Date("2024-01-18"),
  },
  {
    id: 3,
    nombre: "Proyectos",
    usuario_id: 1,
    fecha_creacion: new Date("2024-01-05"),
    fecha_modificacion: new Date("2024-01-22"),
  },
]

const initialFiles: Archivo[] = [
  {
    id: 1,
    nombre: "Presentación Q1",
    extension: "pptx",
    tamaño: 2500000,
    ruta: "/files/presentacion-q1.pptx",
    usuario_id: 1,
    tipo_archivo_id: 1,
    fecha_creacion: new Date("2024-01-12"),
    fecha_modificacion: new Date("2024-01-15"),
    activo: true,
  },
  {
    id: 2,
    nombre: "Informe Mensual",
    extension: "pdf",
    tamaño: 1200000,
    ruta: "/files/informe-mensual.pdf",
    usuario_id: 1,
    tipo_archivo_id: 2,
    fecha_creacion: new Date("2024-01-08"),
    fecha_modificacion: new Date("2024-01-10"),
    activo: true,
  },
  {
    id: 3,
    nombre: "Foto Vacaciones",
    extension: "jpg",
    tamaño: 3500000,
    ruta: "/files/foto-vacaciones.jpg",
    usuario_id: 1,
    tipo_archivo_id: 3,
    fecha_creacion: new Date("2024-01-01"),
    fecha_modificacion: new Date("2024-01-01"),
    activo: true,
  },
]

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<Archivo[]>(initialFiles)
  const [folders, setFolders] = useState<Carpeta[]>(initialFolders)
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null)
  const [currentPath, setCurrentPath] = useState<{ id: number | null; name: string }[]>([
    { id: null, name: "Mi Drive" },
  ])
  const [loading, setLoading] = useState(false)

  const uploadFile = useCallback(
    async (file: File, folderId?: number) => {
      setLoading(true)
      try {
        // Simular subida de archivo
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newFile: Archivo = {
          id: Date.now(),
          nombre: file.name.split(".").slice(0, -1).join("."),
          extension: file.name.split(".").pop() || "",
          tamaño: file.size,
          ruta: `/files/${file.name}`,
          usuario_id: 1,
          carpeta_id: folderId || currentFolderId || undefined,
          tipo_archivo_id: 1,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date(),
          activo: true,
        }

        setFiles((prev) => [...prev, newFile])
      } finally {
        setLoading(false)
      }
    },
    [currentFolderId],
  )

  const createFolder = useCallback(
    async (name: string, parentId?: number) => {
      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        const newFolder: Carpeta = {
          id: Date.now(),
          nombre: name,
          usuario_id: 1,
          carpeta_padre_id: parentId || currentFolderId || undefined,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date(),
        }

        setFolders((prev) => [...prev, newFolder])
      } finally {
        setLoading(false)
      }
    },
    [currentFolderId],
  )

  const deleteFile = useCallback(async (fileId: number) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setFiles((prev) => prev.filter((file) => file.id !== fileId))
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteFolder = useCallback(async (folderId: number) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setFolders((prev) => prev.filter((folder) => folder.id !== folderId))
      // También eliminar archivos dentro de la carpeta
      setFiles((prev) => prev.filter((file) => file.carpeta_id !== folderId))
    } finally {
      setLoading(false)
    }
  }, [])

  const renameFile = useCallback(async (fileId: number, newName: string) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setFiles((prev) =>
        prev.map((file) => (file.id === fileId ? { ...file, nombre: newName, fecha_modificacion: new Date() } : file)),
      )
    } finally {
      setLoading(false)
    }
  }, [])

  const renameFolder = useCallback(async (folderId: number, newName: string) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === folderId ? { ...folder, nombre: newName, fecha_modificacion: new Date() } : folder,
        ),
      )
    } finally {
      setLoading(false)
    }
  }, [])

  const navigateToFolder = useCallback((folderId: number | null, folderName?: string) => {
    setCurrentFolderId(folderId)

    if (folderId === null) {
      // Navegando a la raíz
      setCurrentPath([{ id: null, name: "Mi Drive" }])
    } else {
      // Navegando a una carpeta específica
      const folderToAdd = { id: folderId, name: folderName || "Carpeta" }
      setCurrentPath((prev) => {
        // Verificar si ya estamos en esta carpeta
        if (prev[prev.length - 1]?.id === folderId) return prev
        // Agregar la nueva carpeta al path
        return [...prev, folderToAdd]
      })
    }
  }, [])

  const refreshFiles = useCallback(async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // En una implementación real, recargarías desde la API
    } finally {
      setLoading(false)
    }
  }, [])

  // Filtrar archivos y carpetas según la carpeta actual
  const currentFiles = files.filter((file) => file.carpeta_id === currentFolderId)
  const currentFolders = folders.filter((folder) => folder.carpeta_padre_id === currentFolderId)

  return (
    <FileContext.Provider
      value={{
        files: currentFiles,
        folders: currentFolders,
        currentFolderId,
        currentPath,
        loading,
        uploadFile,
        createFolder,
        deleteFile,
        deleteFolder,
        renameFile,
        renameFolder,
        navigateToFolder,
        refreshFiles,
      }}
    >
      {children}
    </FileContext.Provider>
  )
}

export function useFiles() {
  const context = useContext(FileContext)
  if (context === undefined) {
    throw new Error("useFiles must be used within a FileProvider")
  }
  return context
}
