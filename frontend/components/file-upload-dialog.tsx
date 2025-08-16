"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { UploadIcon, FileIcon, XIcon } from "lucide-react"

interface FileUploadDialogProps {
  children: React.ReactNode
}

export function FileUploadDialog({ children }: FileUploadDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    setSelectedFiles(files)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      alert("No user logged in")
      return
    }
    const user = JSON.parse(storedUser)
    const userId = user.id

    setUploading(true)
    try {
      for (const file of selectedFiles) {
        const body = {
          nombre: file.name,
          id_tipo_archivo: 1, // make sure this exists in DB
          id_usuario_propietario: userId,
          tamano_archivo: file.size,
        }

        const res = await fetch("http://localhost:8000/archivos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(`Error uploading ${file.name}: ${text}`)
        }

        const data = await res.json()
        console.log("Upload success:", data)
      }

      setSelectedFiles([])
      setOpen(false)
      alert("Archivos subidos correctamente")
    } catch (err: any) {
      console.error(err)
      alert(err.message || "Error uploading files")
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subir archivos</DialogTitle>
          <DialogDescription>Selecciona archivos para subir a tu Drive</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">Arrastra archivos aquí o</p>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              Seleccionar archivos
            </Button>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Archivos seleccionados:</h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <FileIcon className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium truncate max-w-48">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)} disabled={uploading}>
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subiendo archivos...</span>
                <span>0%</span>
              </div>
              <Progress value={0} className="w-full" />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={uploading}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {uploading
                ? "Subiendo..."
                : `Subir ${selectedFiles.length} archivo${selectedFiles.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
