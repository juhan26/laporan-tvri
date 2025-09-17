"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { LogOut, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Header() {
  const { userProfile, signOut } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
      if (typeof window !== "undefined") {
        localStorage.clear()
        sessionStorage.clear()
      }
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/auth/login")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-blue-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="bg-white text-blue-800 px-3 py-1 rounded font-bold">TVRI</div>
          <h1 className="text-xl font-bold">Sistem Laporan Siaran</h1>
        </div>

        <div className="flex items-center space-x-4">
          <span>
            Halo, {userProfile?.name} ({userProfile?.role})
          </span>
          <Button
            onClick={handleLogout}
            variant="secondary"
            size="sm"
            className="bg-blue-700 hover:bg-blue-900 text-white"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
