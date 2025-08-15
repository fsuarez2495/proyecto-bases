"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  FolderIcon,
  FileTextIcon,
  ImageIcon,
  VideoIcon,
  FileIcon,
  MoreVerticalIcon,
  ShareIcon,
  DownloadIcon,
  TrashIcon,
  StarIcon,
  PlusIcon,
  EditIcon,
  ChevronRightIcon,
  MessageCircleIcon,
} from "lucide-react"
import { useFiles } from "@/contexts/file-context"
import { useComments } from "@/contexts/comments-context"
import { FileUploadDialog } from "./file-upload-dialog"
import { CreateFolderDialog } from "./create-folder-dialog"
import { RenameDialog } from "./rename-dialog"
import { ShareDialog } from "./share-dialog"
import { CommentsPanel } from "./comments-panel"

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

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function FileGrid() {
  const { files, folders, currentPath, navigateToFolder, deleteFile, deleteFolder } = useFiles()
  const { getCommentsForFile } = useComments()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: any; type: "file" | "folder" } | null>(null)
  const [renameDialog, setRenameDialog] = useState<{ open: boolean; item: any } | null>(null)
  const [commentsPanel, setCommentsPanel] = useState<{ open: boolean; fileId: number; fileName: string } | null>(null)

  const handleItemSelect = (id: string, type: "file" | "folder") => {
    const itemId = `${type}-${id}`
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((item) => item !== itemId) : [...prev, itemId]))
  }

  const handleFolderDoubleClick = (folder: any) => {
    navigateToFolder(folder.id, folder.nombre)
  }

  const handleBreadcrumbClick = (pathIndex: number) => {
    const targetPath = currentPath[pathIndex]
    navigateToFolder(targetPath.id, targetPath.name)
  }

  const handleDelete = async () => {
    if (!deleteDialog) return

    if (deleteDialog.type === "file") {
      await deleteFile(deleteDialog.item.id)
    } else {
      await deleteFolder(deleteDialog.item.id)
    }

    setDeleteDialog(null)
  }

  const openCommentsPanel = (fileId: number, fileName: string) => {
    setCommentsPanel({ open: true, fileId, fileName })
  }

  const closeCommentsPanel = () => {
    setCommentsPanel(null)
  }

  return (
    <div className="p-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            {currentPath.map((path, index) => (
              <div key={path.id || "root"} className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => handleBreadcrumbClick(index)}
                    className="cursor-pointer hover:text-blue-600"
                  >
                    {path.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < currentPath.length - 1 && (
                  <BreadcrumbSeparator>
                    <ChevronRightIcon className="w-4 h-4" />
                  </BreadcrumbSeparator>
                )}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Carpetas */}
      {folders.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Carpetas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {folders.map((folder) => (
              <Card
                key={folder.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  selectedItems.includes(`folder-${folder.id}`) ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handleItemSelect(folder.id.toString(), "folder")}
                onDoubleClick={() => handleFolderDoubleClick(folder)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <FolderIcon className="w-8 h-8 text-blue-500" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVerticalIcon className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            setRenameDialog({
                              open: true,
                              item: { id: folder.id, name: folder.nombre, type: "folder" },
                            })
                          }
                        >
                          <EditIcon className="mr-2 h-4 w-4" />
                          Renombrar
                        </DropdownMenuItem>
                        <ShareDialog item={{ id: folder.id, name: folder.nombre, type: "folder" }}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <ShareIcon className="mr-2 h-4 w-4" />
                            Compartir
                          </DropdownMenuItem>
                        </ShareDialog>
                        <DropdownMenuItem>
                          <StarIcon className="mr-2 h-4 w-4" />
                          Destacar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteDialog({ open: true, item: folder, type: "folder" })}
                        >
                          <TrashIcon className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h4 className="font-medium text-sm text-gray-900 truncate">{folder.nombre}</h4>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(folder.fecha_modificacion)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Archivos */}
      {files.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Archivos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {files.map((file) => {
              const fileComments = getCommentsForFile(file.id)
              const hasComments = fileComments.length > 0

              return (
                <Card
                  key={file.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedItems.includes(`file-${file.id}`) ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => handleItemSelect(file.id.toString(), "file")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      {getFileIcon(file.extension)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVerticalIcon className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              setRenameDialog({ open: true, item: { id: file.id, name: file.nombre, type: "file" } })
                            }
                          >
                            <EditIcon className="mr-2 h-4 w-4" />
                            Renombrar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            Descargar
                          </DropdownMenuItem>
                          <ShareDialog item={{ id: file.id, name: `${file.nombre}.${file.extension}`, type: "file" }}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <ShareIcon className="mr-2 h-4 w-4" />
                              Compartir
                            </DropdownMenuItem>
                          </ShareDialog>
                          <DropdownMenuItem
                            onClick={() => openCommentsPanel(file.id, `${file.nombre}.${file.extension}`)}
                          >
                            <MessageCircleIcon className="mr-2 h-4 w-4" />
                            Comentarios {hasComments && `(${fileComments.length})`}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <StarIcon className="mr-2 h-4 w-4" />
                            Destacar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteDialog({ open: true, item: file, type: "file" })}
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {file.nombre}.{file.extension}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.tamaño)} • {formatDate(file.fecha_modificacion)}
                      </p>
                      {hasComments && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          <MessageCircleIcon className="w-3 h-3 mr-1" />
                          {fileComments.length}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {folders.length === 0 && files.length === 0 && (
        <div className="text-center py-12">
          <FolderIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay archivos aquí</h3>
          <p className="text-gray-500 mb-4">Arrastra archivos aquí o usa el botón "Nuevo" para comenzar</p>
          <div className="flex justify-center space-x-2">
            <FileUploadDialog>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="w-4 h-4 mr-2" />
                Subir archivos
              </Button>
            </FileUploadDialog>
            <CreateFolderDialog>
              <Button variant="outline">
                <FolderIcon className="w-4 h-4 mr-2" />
                Nueva carpeta
              </Button>
            </CreateFolderDialog>
          </div>
        </div>
      )}

      {/* Panel de comentarios */}
      {commentsPanel && (
        <CommentsPanel
          fileId={commentsPanel.fileId}
          fileName={commentsPanel.fileName}
          isOpen={commentsPanel.open}
          onClose={closeCommentsPanel}
        />
      )}

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={deleteDialog?.open || false} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente {deleteDialog?.type === "file" ? "el archivo" : "la carpeta"} "
              {deleteDialog?.item?.nombre || deleteDialog?.item?.name}".
              {deleteDialog?.type === "folder" && " Todos los archivos dentro de la carpeta también serán eliminados."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de renombrar */}
      <RenameDialog
        open={renameDialog?.open || false}
        onOpenChange={(open) => !open && setRenameDialog(null)}
        item={renameDialog?.item || null}
      />
    </div>
  )
}
