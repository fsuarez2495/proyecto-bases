"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DriveHeader } from "@/components/drive-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserIcon, HardDriveIcon, PaletteIcon, ShieldIcon, ArrowLeftIcon } from "lucide-react"
import { PersonalInfoSettings } from "@/components/settings/personal-info-settings"
import { StorageSettings } from "@/components/settings/storage-settings"
import { ColorSettings } from "@/components/settings/color-settings"
import { PrivacySettings } from "@/components/settings/privacy-settings"
import Link from "next/link"

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("personal")

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <DriveHeader />

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Volver al Drive
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
              <p className="text-gray-600">Gestiona tu cuenta y preferencias</p>
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal" className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4" />
                <span>Personal</span>
              </TabsTrigger>
              <TabsTrigger value="storage" className="flex items-center space-x-2">
                <HardDriveIcon className="w-4 h-4" />
                <span>Almacenamiento</span>
              </TabsTrigger>
              <TabsTrigger value="colors" className="flex items-center space-x-2">
                <PaletteIcon className="w-4 h-4" />
                <span>Colores</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center space-x-2">
                <ShieldIcon className="w-4 h-4" />
                <span>Privacidad</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <PersonalInfoSettings />
            </TabsContent>

            <TabsContent value="storage">
              <StorageSettings />
            </TabsContent>

            <TabsContent value="colors">
              <ColorSettings />
            </TabsContent>

            <TabsContent value="privacy">
              <PrivacySettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
