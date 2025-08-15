"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { CloudIcon, HardDriveIcon, MoveUpIcon as UpgradeIcon, TrashIcon } from "lucide-react"

const storagePlans = [
  {
    id: 1,
    name: "Básico",
    storage: 15000000000, // 15GB
    price: "Gratis",
    features: ["15 GB de almacenamiento", "Acceso desde cualquier dispositivo", "Compartir archivos"],
  },
  {
    id: 2,
    name: "Pro",
    storage: 100000000000, // 100GB
    price: "$1.99/mes",
    features: ["100 GB de almacenamiento", "Sin anuncios", "Soporte prioritario", "Historial de versiones"],
  },
  {
    id: 3,
    name: "Business",
    storage: 2000000000000, // 2TB
    price: "$9.99/mes",
    features: ["2 TB de almacenamiento", "Colaboración avanzada", "Controles de administrador", "Auditoría completa"],
  },
]

export function StorageSettings() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  if (!user) return null

  const storageUsed = user.almacenamiento.espacio_usado
  const storageTotal = user.almacenamiento.espacio_total
  const storagePercentage = (storageUsed / storageTotal) * 100

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const handleUpgrade = async (planId: number) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Plan actualizado",
        description: "Tu plan de almacenamiento ha sido actualizado correctamente",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCleanup = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Limpieza completada",
        description: "Se han eliminado archivos temporales y duplicados",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardDriveIcon className="w-5 h-5 mr-2" />
            Uso de almacenamiento
          </CardTitle>
          <CardDescription>Gestiona tu espacio de almacenamiento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Espacio usado</span>
              <span>
                {formatBytes(storageUsed)} de {formatBytes(storageTotal)}
              </span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
            <p className="text-xs text-gray-500">{storagePercentage.toFixed(1)}% utilizado</p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <CloudIcon className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-sm font-medium">Archivos</p>
              <p className="text-xs text-gray-500">{formatBytes(storageUsed * 0.7)}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <HardDriveIcon className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <p className="text-sm font-medium">Fotos</p>
              <p className="text-xs text-gray-500">{formatBytes(storageUsed * 0.2)}</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <TrashIcon className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <p className="text-sm font-medium">Papelera</p>
              <p className="text-xs text-gray-500">{formatBytes(storageUsed * 0.1)}</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={handleCleanup} disabled={loading}>
              <TrashIcon className="w-4 h-4 mr-2" />
              Limpiar archivos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Storage Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Planes de almacenamiento</CardTitle>
          <CardDescription>Elige el plan que mejor se adapte a tus necesidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {storagePlans.map((plan) => {
              const isCurrentPlan = plan.storage === storageTotal

              return (
                <div
                  key={plan.id}
                  className={`relative p-4 border rounded-lg ${
                    isCurrentPlan ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  {isCurrentPlan && <Badge className="absolute -top-2 left-4 bg-blue-600">Plan actual</Badge>}

                  <div className="text-center space-y-3">
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-2xl font-bold text-blue-600">{plan.price}</p>
                    <p className="text-sm text-gray-600">{formatBytes(plan.storage)} de almacenamiento</p>

                    <ul className="space-y-1 text-xs text-gray-600">
                      {plan.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>

                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? "outline" : "default"}
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isCurrentPlan || loading}
                    >
                      {isCurrentPlan ? (
                        "Plan actual"
                      ) : (
                        <>
                          <UpgradeIcon className="w-4 h-4 mr-2" />
                          Actualizar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Storage Management */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de almacenamiento</CardTitle>
          <CardDescription>Herramientas para optimizar tu espacio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">Archivos grandes</p>
              <p className="text-sm text-gray-500">Encuentra y gestiona archivos que ocupan mucho espacio</p>
            </div>
            <Button variant="outline">Ver archivos</Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">Archivos duplicados</p>
              <p className="text-sm text-gray-500">Identifica y elimina archivos duplicados</p>
            </div>
            <Button variant="outline">Buscar duplicados</Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">Papelera</p>
              <p className="text-sm text-gray-500">Vaciar papelera para liberar espacio</p>
            </div>
            <Button variant="outline">Vaciar papelera</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
