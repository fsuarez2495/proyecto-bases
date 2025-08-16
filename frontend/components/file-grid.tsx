"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrashIcon,
  FileTextIcon,
  ImageIcon,
  VideoIcon,
  FileIcon,
  MessageCircleIcon,
  FolderIcon,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { useComments } from "@/contexts/comments-context"
import { CommentsPanel } from "./comments-panel"

interface File {
  id_archivo: number
  nombre: string
  extension: string
  tamano_archivo: number
  fecha_creacion: string
}

interface Folder {
  id_carpeta: number
  nombre: string
  fecha_creacion: string
}

function getFileIcon(extension: string) {
  switch (extension.toLowerCase()) {
    case "pdf":
    case "doc":
    case "docx":
    case "txt":
      return <FileTextIcon className="w-8 h-8 text-red-500" />
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <ImageIcon className="w-8 h-8 text-green-500" />
    case "mp4":
    case "avi":
    case "mov":
      return <VideoIcon className="w-8 h-8 text-purple-500" />
    default:
      return <FileIcon className="w-8 h-8 text-gray-500" />
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
}

export function FileGrid() {
  const { getCommentsForFile } = useComments()

  const [files, setFiles] = useState<File[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    id: number
    name: string
    type: "file" | "folder"
  } | null>(null)

  const [commentsPanel, setCommentsPanel] = useState<{
    open: boolean
    fileId: number
    fileName: string
  } | null>(null)

  // Fetch files and folders for current user
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const storedUser = localStorage.getItem("user")
        if (!storedUser) {
          setFiles([])
          setFolders([])
          return
        }
        const user = JSON.parse(storedUser)
        const userId = user.id

        // Fetch files
        const filesRes = await fetch("http://localhost:8000/archivos")
        const filesData = await filesRes.json()
        const userFiles = filesData
          .filter((f: any) => f.id_usuario_propietario === userId)
          .map((f: any) => ({ ...f, extension: f.nombre.split(".").pop()?.toLowerCase() || "" }))
        setFiles(userFiles)

        // Fetch folders
        const foldersRes = await fetch("http://localhost:8000/carpetas")
        const foldersData = await foldersRes.json()
        const userFolders = foldersData.filter((f: any) => f.id_usuario_propietario === userId)
        setFolders(userFolders)
      } catch (err) {
        console.error("Error fetching data:", err)
        setFiles([])
        setFolders([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Delete a file or folder
  const handleDelete = async (id: number, type: "file" | "folder") => {
    try {
      const endpoint =
        type === "file"
          ? `http://localhost:8000/archivos/${id}`
          : `http://localhost:8000/carpetas/${id}`
      const res = await fetch(endpoint, { method: "DELETE" })
      if (!res.ok) throw new Error(`Failed to delete ${type}`)
      if (type === "file") setFiles((prev) => prev.filter((f) => f.id_archivo !== id))
      else setFolders((prev) => prev.filter((f) => f.id_carpeta !== id))
      setDeleteDialog(null)
    } catch (err) {
      console.error("Error deleting:", err)
    }
  }

  if (loading) return <p>Cargando archivos y carpetas...</p>
  if (!files.length && !folders.length) return <p>No hay archivos ni carpetas para mostrar</p>

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Folders */}
        {folders.map((folder) => (
          <Card key={folder.id_carpeta} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <FolderIcon className="w-8 h-8 text-blue-500" />
              </div>
              <h4 className="font-medium text-sm text-gray-900 truncate">{folder.nombre}</h4>
              <p className="text-xs text-gray-500 mt-1">Creado: {formatDate(folder.fecha_creacion)}</p>
              <Button
                variant="destructive"
                size="sm"
                className="mt-2 h-6 px-2 text-xs flex items-center justify-center"
                onClick={() =>
                  setDeleteDialog({
                    open: true,
                    id: folder.id_carpeta,
                    name: folder.nombre,
                    type: "folder",
                  })
                }
              >
                <TrashIcon className="w-3 h-3 mr-1" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Files */}
        {files.map((file) => {
          const fileComments = getCommentsForFile(file.id_archivo)
          const hasComments = fileComments.length > 0
          return (
            <Card key={file.id_archivo} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  {getFileIcon(file.extension)}
                  {hasComments && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      <MessageCircleIcon className="w-3 h-3 mr-1" />
                      {fileComments.length}
                    </Badge>
                  )}
                </div>
                <h4 className="font-medium text-sm text-gray-900 truncate">{file.nombre}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(file.tamano_archivo)} • {formatDate(file.fecha_creacion)}
                </p>
                <div className="flex space-x-2 mt-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-6 px-2 text-xs flex items-center justify-center"
                    onClick={() =>
                      setDeleteDialog({ open: true, id: file.id_archivo, name: file.nombre, type: "file" })
                    }
                  >
                    <TrashIcon className="w-3 h-3 mr-1" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs flex items-center justify-center"
                    onClick={() =>
                      setCommentsPanel({ open: true, fileId: file.id_archivo, fileName: file.nombre })
                    }
                  >
                    <MessageCircleIcon className="w-3 h-3 mr-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Confirmation dialog */}
      {deleteDialog && (
        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente {deleteDialog.type} "{deleteDialog.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDelete(deleteDialog.id, deleteDialog.type)}
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Comments panel */}
      {commentsPanel && (
        <CommentsPanel
          fileId={commentsPanel.fileId}
          fileName={commentsPanel.fileName}
          isOpen={commentsPanel?.open ?? false}
          onClose={() => setCommentsPanel(null)}
        />
      )}
    </>
  )
}
