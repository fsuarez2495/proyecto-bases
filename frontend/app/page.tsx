"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { DriveHeader } from "@/components/drive-header"
import { DriveSidebar } from "@/components/drive-sidebar"
import { FileGrid } from "@/components/file-grid"
import { SharedWithMe } from "@/components/shared-with-me"

export default function HomePage() {
  const { user, loading } = useAuth()
  const [currentSection, setCurrentSection] = useState("mi-drive")

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  const renderMainContent = () => {
    switch (currentSection) {
      case "compartido-conmigo":
        return <SharedWithMe />
      case "mi-drive":
      default:
        return <FileGrid />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <DriveHeader />

      <div className="flex flex-1 overflow-hidden">
        <DriveSidebar onSectionChange={setCurrentSection} />

        <main className="flex-1 overflow-auto bg-white">{renderMainContent()}</main>
      </div>
    </div>
  )
}
