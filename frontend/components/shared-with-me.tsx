"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useSharing } from "@/contexts/sharing-context"
import { FileTextIcon, ImageIcon, VideoIcon, FileIcon, FolderIcon } from "lucide-react"

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

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function SharedWithMe() {
  const { getSharedWithMe, accessTypes, users } = useSharing()
  const sharedItems = getSharedWithMe()

  const getAccessTypeName = (accessTypeId: number) => {
    return accessTypes.find((type) => type.id === accessTypeId)?.nombre || "Desconocido"
  }

  const getUserInfo = (userId: number) => {
    return users.find((user) => user.id === userId)
  }

  if (sharedItems.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FolderIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay archivos compartidos</h3>
          <p className="text-gray-500">Los archivos que otros compartan contigo aparecerán aquí</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Compartido conmigo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {sharedItems.map((share) => {
          const owner = getUserInfo(share.usuario_propietario_id)
          const accessType = getAccessTypeName(share.tipo_acceso_id)

          return (
            <Card key={share.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  {share.archivo_id ? (
                    getFileIcon("pdf") // En una implementación real, obtendrías la extensión del archivo
                  ) : (
                    <FolderIcon className="w-8 h-8 text-blue-500" />
                  )}
                </div>
                <h4 className="font-medium text-sm text-gray-900 truncate mb-2">
                  {share.archivo_id ? "Archivo Compartido" : "Carpeta Compartida"}
                </h4>
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="w-5 h-5">
                    <AvatarFallback className="text-xs">
                      {owner?.nombre.charAt(0)}
                      {owner?.apellido.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-500 truncate">
                    {owner?.nombre} {owner?.apellido}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {accessType}
                  </Badge>
                  <p className="text-xs text-gray-500">{formatDate(share.fecha_compartido)}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
