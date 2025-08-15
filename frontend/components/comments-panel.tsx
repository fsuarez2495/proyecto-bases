"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useComments } from "@/contexts/comments-context"
import { useAuth } from "@/contexts/auth-context"
import { useSharing } from "@/contexts/sharing-context"
import { MessageCircleIcon, SendIcon, MoreVerticalIcon, TrashIcon, XIcon } from "lucide-react"

interface CommentsPanelProps {
  fileId: number
  fileName: string
  isOpen: boolean
  onClose: () => void
}

export function CommentsPanel({ fileId, fileName, isOpen, onClose }: CommentsPanelProps) {
  const [newComment, setNewComment] = useState("")
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; commentId: number } | null>(null)
  const { getCommentsForFile, addComment, deleteComment, loading } = useComments()
  const { user } = useAuth()
  const { users } = useSharing()

  const fileComments = getCommentsForFile(fileId)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    await addComment(fileId, newComment)
    setNewComment("")
  }

  const handleDeleteComment = async () => {
    if (!deleteDialog) return
    await deleteComment(deleteDialog.commentId)
    setDeleteDialog(null)
  }

  const getUserInfo = (userId: number) => {
    return users.find((u) => u.id === userId)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? "s" : ""}`
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `hace ${hours} hora${hours !== 1 ? "s" : ""}`
    } else {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <MessageCircleIcon className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="font-medium text-gray-900">Comentarios</h3>
            <p className="text-sm text-gray-500 truncate max-w-48">{fileName}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <XIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Comments List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {fileComments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No hay comentarios aún</p>
              <p className="text-gray-400 text-xs">Sé el primero en comentar</p>
            </div>
          ) : (
            fileComments.map((comment) => {
              const commentUser = getUserInfo(comment.usuario_id)
              const isOwnComment = user?.id === comment.usuario_id

              return (
                <Card key={comment.id} className="border-0 shadow-none bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                          {commentUser?.nombre.charAt(0)}
                          {commentUser?.apellido.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {commentUser?.nombre} {commentUser?.apellido}
                            </p>
                            <p className="text-xs text-gray-500">{formatDate(comment.fecha_creacion)}</p>
                          </div>
                          {isOwnComment && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreVerticalIcon className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setDeleteDialog({ open: true, commentId: comment.id })}
                                >
                                  <TrashIcon className="mr-2 h-3 w-3" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.contenido}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </ScrollArea>

      {/* Add Comment Form */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <Textarea
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-20 resize-none"
            disabled={loading}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={!newComment.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  <SendIcon className="w-3 h-3 mr-1" />
                  Comentar
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Comment Dialog */}
      <AlertDialog open={deleteDialog?.open || false} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar comentario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente tu comentario. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteComment} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
