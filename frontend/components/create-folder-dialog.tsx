"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFiles } from "@/contexts/file-context"

interface CreateFolderDialogProps {
  children: React.ReactNode
}

interface Color {
  id_color: number
  nombre: string
  codigo_hex: string
}

export function CreateFolderDialog({ children }: CreateFolderDialogProps) {
  const [open, setOpen] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [colors, setColors] = useState<Color[]>([])
  const [selectedColor, setSelectedColor] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const { addFolderToState } = useFiles() // Optional: update your local state after creation

  // 🔹 Fetch colors from backend
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await fetch("http://localhost:8000/colores")
        const data = await res.json()
        setColors(data)
      } catch (error) {
        console.error("Error al cargar colores:", error)
      }
    }

    if (open) fetchColors()
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!folderName.trim() || !selectedColor) return

    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      console.warn("No user logged in")
      return
    }
    const user = JSON.parse(storedUser)
    const userId = user.id

    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/carpetas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: folderName.trim(),
          id_color: selectedColor,
          id_usuario_propietario: userId,
        }),
      })

      if (!res.ok) throw new Error("Error creando carpeta")
      const newFolder = await res.json()

      // Optional: update local state immediately
      if (addFolderToState) addFolderToState(newFolder)

      setFolderName("")
      setSelectedColor(null)
      setOpen(false)
    } catch (err) {
      console.error("Error creando carpeta:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva carpeta</DialogTitle>
          <DialogDescription>Crea una nueva carpeta en tu Drive</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Nombre de la carpeta</Label>
            <Input
              id="folder-name"
              placeholder="Mi nueva carpeta"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Folder color selector */}
          <div className="space-y-2">
            <Label>Color de la carpeta</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.id_color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    selectedColor === color.id_color ? "border-black scale-110" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.codigo_hex }}
                  onClick={() => setSelectedColor(color.id_color)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!folderName.trim() || !selectedColor || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Creando..." : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
