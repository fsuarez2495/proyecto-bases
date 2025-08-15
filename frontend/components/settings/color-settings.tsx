"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FolderIcon, CheckIcon } from "lucide-react"
import type { Color } from "@/types/database"

const availableColors: Color[] = [
  { id: 1, nombre: "Azul", codigo_hex: "#3B82F6" },
  { id: 2, nombre: "Verde", codigo_hex: "#10B981" },
  { id: 3, nombre: "Rojo", codigo_hex: "#EF4444" },
  { id: 4, nombre: "Amarillo", codigo_hex: "#F59E0B" },
  { id: 5, nombre: "Púrpura", codigo_hex: "#8B5CF6" },
  { id: 6, nombre: "Rosa", codigo_hex: "#EC4899" },
  { id: 7, nombre: "Índigo", codigo_hex: "#6366F1" },
  { id: 8, nombre: "Naranja", codigo_hex: "#F97316" },
  { id: 9, nombre: "Teal", codigo_hex: "#14B8A6" },
  { id: 10, nombre: "Gris", codigo_hex: "#6B7280" },
]

export function ColorSettings() {
  const { toast } = useToast()
  const [selectedColors, setSelectedColors] = useState<number[]>([1, 2, 3, 4, 5])
  const [loading, setLoading] = useState(false)

  const handleColorToggle = (colorId: number) => {
    setSelectedColors((prev) => (prev.includes(colorId) ? prev.filter((id) => id !== colorId) : [...prev, colorId]))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Colores actualizados",
        description: "Tus preferencias de color han sido guardadas",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetToDefault = () => {
    setSelectedColors([1, 2, 3, 4, 5])
    toast({
      title: "Colores restablecidos",
      description: "Se han restablecido los colores por defecto",
    })
  }

  return (
    <div className="space-y-6">
      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Paleta de colores para carpetas</CardTitle>
          <CardDescription>Selecciona los colores que quieres usar para organizar tus carpetas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-5 gap-4">
            {availableColors.map((color) => {
              const isSelected = selectedColors.includes(color.id)

              return (
                <button
                  key={color.id}
                  onClick={() => handleColorToggle(color.id)}
                  className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    isSelected ? "border-gray-400 shadow-md" : "border-gray-200"
                  }`}
                  style={{ backgroundColor: `${color.codigo_hex}20` }}
                >
                  <FolderIcon className="w-8 h-8 mx-auto mb-2" style={{ color: color.codigo_hex }} />
                  <p className="text-xs font-medium text-gray-700">{color.nombre}</p>

                  {isSelected && (
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: color.codigo_hex }}
                    >
                      <CheckIcon className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-gray-600">{selectedColors.length} colores seleccionados</p>
            <div className="space-x-2">
              <Button variant="outline" onClick={resetToDefault}>
                Restablecer
              </Button>
              <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? "Guardando..." : "Guardar colores"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Vista previa</CardTitle>
          <CardDescription>Así se verán tus carpetas con los colores seleccionados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {selectedColors.slice(0, 10).map((colorId) => {
              const color = availableColors.find((c) => c.id === colorId)
              if (!color) return null

              return (
                <div key={colorId} className="text-center">
                  <div className="p-3 bg-gray-50 rounded-lg mb-2">
                    <FolderIcon className="w-10 h-10 mx-auto" style={{ color: color.codigo_hex }} />
                  </div>
                  <p className="text-xs text-gray-600">Carpeta {color.nombre}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Color Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Consejos de organización</CardTitle>
          <CardDescription>Aprovecha al máximo los colores para organizar tus archivos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>Azul:</strong> Ideal para documentos de trabajo y proyectos profesionales
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>Verde:</strong> Perfecto para archivos completados o aprobados
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>Rojo:</strong> Útil para marcar elementos urgentes o importantes
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>Amarillo:</strong> Excelente para elementos en progreso o pendientes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
