"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFiles } from "@/contexts/file-context"

interface RenameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: { id: number; name: string; type: "file" | "folder" } | null
}

export function RenameDialog({ open, onOpenChange, item }: RenameDialogProps) {
  const [newName, setNewName] = useState("")
  const { renameFile, renameFolder, loading } = useFiles()

  useEffect(() => {
    if (item) {
      setNewName(item.name)
    }
  }, [item])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !item) return

    if (item.type === "file") {
      await renameFile(item.id, newName.trim())
    } else {
      await renameFolder(item.id, newName.trim())
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Renombrar {item?.type === "file" ? "archivo" : "carpeta"}</DialogTitle>
          <DialogDescription>
            Ingresa el nuevo nombre para {item?.type === "file" ? "el archivo" : "la carpeta"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-name">Nuevo nombre</Label>
            <Input
              id="new-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!newName.trim() || loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Renombrando..." : "Renombrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
