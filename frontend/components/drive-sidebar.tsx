"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { FileUploadDialog } from "./file-upload-dialog"
import { CreateFolderDialog } from "./create-folder-dialog"
import { FolderIcon, ShareIcon, ClockIcon, StarIcon, TrashIcon, CloudIcon, PlusIcon, UploadIcon } from "lucide-react"

interface SidebarItem {
  id: string
  label: string
  icon: React.ReactNode
  count?: number
}

interface DriveSidebarProps {
  onSectionChange?: (section: string) => void
}

export function DriveSidebar({ onSectionChange }: DriveSidebarProps) {
  const { user } = useAuth()
  const [activeItem, setActiveItem] = useState("mi-drive")

  if (!user) return null

  const storageUsed = user.almacenamiento.espacio_usado
  const storageTotal = user.almacenamiento.espacio_total
  const storagePercentage = (storageUsed / storageTotal) * 100

  const sidebarItems: SidebarItem[] = [
    {
      id: "mi-drive",
      label: "Mi Drive",
      icon: <FolderIcon className="w-5 h-5" />,
    },
    {
      id: "compartido-conmigo",
      label: "Compartido conmigo",
      icon: <ShareIcon className="w-5 h-5" />,
    },
    {
      id: "recientes",
      label: "Recientes",
      icon: <ClockIcon className="w-5 h-5" />,
    },
    {
      id: "destacados",
      label: "Destacados",
      icon: <StarIcon className="w-5 h-5" />,
    },
    {
      id: "papelera",
      label: "Papelera",
      icon: <TrashIcon className="w-5 h-5" />,
    },
  ]

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId)
    onSectionChange?.(itemId)
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Botón Nuevo */}
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <PlusIcon className="w-4 h-4 mr-2" />
              Nuevo
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <CreateFolderDialog>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <FolderIcon className="mr-2 h-4 w-4" />
                Nueva carpeta
              </DropdownMenuItem>
            </CreateFolderDialog>
            <FileUploadDialog>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <UploadIcon className="mr-2 h-4 w-4" />
                Subir archivos
              </DropdownMenuItem>
            </FileUploadDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeItem === item.id
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
                {item.count && (
                  <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{item.count}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Indicador de almacenamiento */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-2">
          <CloudIcon className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-700">Almacenamiento</span>
        </div>
        <Progress value={storagePercentage} className="mb-2" />
        <p className="text-xs text-gray-500">
          {(storageUsed / 1000000000).toFixed(1)} GB de {(storageTotal / 1000000000).toFixed(0)} GB usados
        </p>
        <Button variant="outline" size="sm" className="w-full mt-2 text-xs bg-transparent">
          Comprar almacenamiento
        </Button>
      </div>
    </div>
  )
}
