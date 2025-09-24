"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { LogOut, Loader2, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import logo from "@/public/image.png"

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

  const handleHardRefresh = () => {
    if (typeof window !== "undefined") {
      window.location.reload() // reload halaman, mirip hard refresh
    }
  }

  return (
    <header className="bg-white text-[#192d74] p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image src={logo} alt="logo" width={50} height={50} />
          <h1 className="text-xl font-bold">Sistem Laporan Siaran</h1>
        </div>

        <div className="flex items-center space-x-4">
          <span>
            Halo, {userProfile?.name} ({userProfile?.role})
          </span>

          <Button
            onClick={handleHardRefresh}
            variant="secondary"
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Button
            onClick={handleLogout}
            variant="secondary"
            size="sm"
            className="bg-[#192d74] hover:bg-blue-900 text-white"
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
