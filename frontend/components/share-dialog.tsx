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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSharing } from "@/contexts/sharing-context"
import { ShareIcon, UserPlusIcon, MoreHorizontalIcon, TrashIcon, LinkIcon, CopyIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareDialogProps {
  children: React.ReactNode
  item: { id: number; name: string; type: "file" | "folder" }
}

export function ShareDialog({ children, item }: ShareDialogProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [accessType, setAccessType] = useState("1")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const { shareItem, updateAccess, removeAccess, getSharedUsers, accessTypes, searchUsers, loading, users } =
    useSharing()
  const { toast } = useToast()

  const sharedUsers = getSharedUsers(item.id, item.type)

  useEffect(() => {
    if (email.length > 2) {
      const results = searchUsers(email)
      setSearchResults(results)
      setShowSearch(true)
    } else {
      setSearchResults([])
      setShowSearch(false)
    }
  }, [email, searchUsers])

  const handleShare = async () => {
    if (!email.trim()) return

    const success = await shareItem(item.id, item.type, email.trim(), Number.parseInt(accessType))
    if (success) {
      setEmail("")
      setAccessType("1")
      setShowSearch(false)
      toast({
        title: "Compartido exitosamente",
        description: `${item.type === "file" ? "El archivo" : "La carpeta"} ha sido compartido con ${email}`,
      })
    } else {
      toast({
        title: "Error al compartir",
        description: "No se pudo compartir el elemento. Verifica el email e intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleUserSelect = (user: any) => {
    setEmail(user.email)
    setShowSearch(false)
  }

  const handleAccessChange = async (shareId: number, newAccessTypeId: string) => {
    await updateAccess(shareId, Number.parseInt(newAccessTypeId))
    toast({
      title: "Permisos actualizados",
      description: "Los permisos de acceso han sido actualizados",
    })
  }

  const handleRemoveAccess = async (shareId: number) => {
    await removeAccess(shareId)
    toast({
      title: "Acceso removido",
      description: "El acceso al elemento ha sido removido",
    })
  }

  const copyShareLink = () => {
    const shareLink = `${window.location.origin}/shared/${item.type}/${item.id}`
    navigator.clipboard.writeText(shareLink)
    toast({
      title: "Enlace copiado",
      description: "El enlace de compartir ha sido copiado al portapapeles",
    })
  }

  const getAccessTypeName = (accessTypeId: number) => {
    return accessTypes.find((type) => type.id === accessTypeId)?.nombre || "Desconocido"
  }

  const getUserInfo = (userId: number) => {
    return users.find((user) => user.id === userId)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShareIcon className="w-5 h-5 mr-2" />
            Compartir "{item.name}"
          </DialogTitle>
          <DialogDescription>
            Invita a personas para que puedan acceder a este {item.type === "file" ? "archivo" : "carpeta"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Enlace de compartir */}
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <LinkIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 flex-1">Cualquiera con el enlace</span>
            <Button variant="ghost" size="sm" onClick={copyShareLink}>
              <CopyIcon className="w-4 h-4" />
            </Button>
          </div>

          {/* Agregar personas */}
          <div className="space-y-2">
            <Label>Agregar personas</Label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Ingresa email o nombre"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                {showSearch && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 text-left"
                        onClick={() => handleUserSelect(user)}
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {user.nombre.charAt(0)}
                            {user.apellido.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {user.nombre} {user.apellido}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Select value={accessType} onValueChange={setAccessType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accessTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleShare} disabled={!email.trim() || loading}>
                <UserPlusIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Lista de personas con acceso */}
          {sharedUsers.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Personas con acceso</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {sharedUsers.map((share) => {
                    const user = getUserInfo(share.usuario_compartido_id)
                    if (!user) return null

                    return (
                      <div key={share.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-sm">
                              {user.nombre.charAt(0)}
                              {user.apellido.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {user.nombre} {user.apellido}
                            </p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {getAccessTypeName(share.tipo_acceso_id)}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontalIcon className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {accessTypes.map((type) => (
                                <DropdownMenuItem
                                  key={type.id}
                                  onClick={() => handleAccessChange(share.id, type.id.toString())}
                                >
                                  {type.nombre}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuItem className="text-red-600" onClick={() => handleRemoveAccess(share.id)}>
                                <TrashIcon className="mr-2 h-4 w-4" />
                                Remover acceso
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
