"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface Comment {
  id_comentario: number
  descripcion: string
  fecha_comentario: string
  id_usuario_comentador: number
  id_archivo: number
}

interface CommentsPanelProps {
  fileId: number
  fileName: string
  isOpen: boolean
  onClose: () => void
}

export function CommentsPanel({ fileId, fileName, isOpen, onClose }: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)

  // Fetch comments when modal opens
  const fetchComments = async () => {
    try {
      const res = await fetch("http://localhost:8000/comentarios")
      const data: Comment[] = await res.json()
      const fileComments = data.filter((c) => c.id_archivo === fileId)
      setComments(fileComments)
    } catch (err) {
      console.error("Error fetching comments:", err)
    }
  }

  useEffect(() => {
    if (isOpen) fetchComments()
  }, [isOpen])

  const handleAddComment = async () => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser || !newComment.trim()) return
    const user = JSON.parse(storedUser)

    const payload = {
      descripcion: newComment.trim(),
      id_usuario_comentador: user.id,
      id_archivo: fileId,
    }

    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to post comment")
      const created = await res.json()
      setComments((prev) => [...prev, created])
      setNewComment("")
    } catch (err) {
      console.error("Error posting comment:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Comentarios: {fileName}</DialogTitle>
          <DialogDescription>
            Aquí puedes ver y agregar comentarios al archivo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[400px] overflow-y-auto mt-4">
          {comments.length ? (
            comments.map((c) => (
              <div key={c.id_comentario} className="border-b py-2">
                <p className="text-sm">{c.descripcion}</p>
                <p className="text-xs text-gray-500">
                  {new Date(c.fecha_comentario).toLocaleString("es-ES")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No hay comentarios todavía.</p>
          )}
        </div>

        <div className="flex mt-4 gap-2">
          <Input
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={loading}
          />
          <Button onClick={handleAddComment} disabled={loading}>
            {loading ? "Enviando..." : "Agregar"}
          </Button>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
