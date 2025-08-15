"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ShieldIcon, EyeIcon, UsersIcon, BellIcon } from "lucide-react"

export function PrivacySettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    profileVisibility: "private",
    allowFileSharing: true,
    allowComments: true,
    emailNotifications: true,
    shareNotifications: true,
    commentNotifications: true,
    activityTracking: false,
    dataCollection: false,
  })

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Configuración guardada",
        description: "Tus preferencias de privacidad han sido actualizadas",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <EyeIcon className="w-5 h-5 mr-2" />
            Privacidad del perfil
          </CardTitle>
          <CardDescription>Controla quién puede ver tu información</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-visibility">Visibilidad del perfil</Label>
            <Select
              value={settings.profileVisibility}
              onValueChange={(value) => handleSettingChange("profileVisibility", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Público - Visible para todos</SelectItem>
                <SelectItem value="contacts">Contactos - Solo personas que conozco</SelectItem>
                <SelectItem value="private">Privado - Solo yo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sharing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UsersIcon className="w-5 h-5 mr-2" />
            Configuración de compartir
          </CardTitle>
          <CardDescription>Gestiona cómo otros pueden interactuar con tus archivos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-sharing">Permitir compartir archivos</Label>
              <p className="text-sm text-gray-500">Otros pueden compartir tus archivos con terceros</p>
            </div>
            <Switch
              id="allow-sharing"
              checked={settings.allowFileSharing}
              onCheckedChange={(checked) => handleSettingChange("allowFileSharing", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-comments">Permitir comentarios</Label>
              <p className="text-sm text-gray-500">Otros pueden comentar en tus archivos compartidos</p>
            </div>
            <Switch
              id="allow-comments"
              checked={settings.allowComments}
              onCheckedChange={(checked) => handleSettingChange("allowComments", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BellIcon className="w-5 h-5 mr-2" />
            Notificaciones
          </CardTitle>
          <CardDescription>Controla qué notificaciones quieres recibir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Notificaciones por email</Label>
              <p className="text-sm text-gray-500">Recibir actualizaciones importantes por correo</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="share-notifications">Notificaciones de compartir</Label>
              <p className="text-sm text-gray-500">Cuando alguien comparte un archivo contigo</p>
            </div>
            <Switch
              id="share-notifications"
              checked={settings.shareNotifications}
              onCheckedChange={(checked) => handleSettingChange("shareNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="comment-notifications">Notificaciones de comentarios</Label>
              <p className="text-sm text-gray-500">Cuando alguien comenta en tus archivos</p>
            </div>
            <Switch
              id="comment-notifications"
              checked={settings.commentNotifications}
              onCheckedChange={(checked) => handleSettingChange("commentNotifications", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldIcon className="w-5 h-5 mr-2" />
            Datos y privacidad
          </CardTitle>
          <CardDescription>Controla cómo se usan tus datos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="activity-tracking">Seguimiento de actividad</Label>
              <p className="text-sm text-gray-500">Permitir análisis de uso para mejorar el servicio</p>
            </div>
            <Switch
              id="activity-tracking"
              checked={settings.activityTracking}
              onCheckedChange={(checked) => handleSettingChange("activityTracking", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="data-collection">Recopilación de datos</Label>
              <p className="text-sm text-gray-500">Permitir recopilación de datos para personalización</p>
            </div>
            <Switch
              id="data-collection"
              checked={settings.dataCollection}
              onCheckedChange={(checked) => handleSettingChange("dataCollection", checked)}
            />
          </div>

          <div className="pt-4 border-t">
            <div className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent">
                Descargar mis datos
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700 bg-transparent">
                Eliminar mi cuenta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? "Guardando..." : "Guardar configuración"}
        </Button>
      </div>
    </div>
  )
}
