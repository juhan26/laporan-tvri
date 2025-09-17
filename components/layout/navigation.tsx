"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { BarChart3, FileText, Plus, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/dashboard" },
  { id: "reports", label: "Data Laporan", icon: FileText, href: "/reports" },
]

export function Navigation() {
  const { userProfile } = useAuth()
  const pathname = usePathname()

  const canCreateReports = userProfile?.role === "admin" || userProfile?.role === "operator"
  const canManageUsers = userProfile?.role === "admin"

  return (
    <nav className="bg-blue-700 text-white">
      <div className="container mx-auto">
        <div className="flex space-x-1">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              asChild
              variant="ghost"
              className={`flex items-center space-x-2 px-4 py-3 rounded-none transition-colors ${
                pathname === item.href
                  ? "bg-blue-900 border-b-2 border-white text-white"
                  : "hover:bg-blue-600 text-white"
              }`}
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
          {canManageUsers && (
            <Button
              asChild
              variant="ghost"
              className={`flex items-center space-x-2 px-4 py-3 rounded-none transition-colors ${
                pathname === "/users"
                  ? "bg-blue-900 border-b-2 border-white text-white"
                  : "hover:bg-blue-600 text-white"
              }`}
            >
              <Link href="/users">
                <Users className="h-4 w-4" />
                <span>Kelola User</span>
              </Link>
            </Button>
          )}
          {canCreateReports && (
            <Button
              asChild
              variant="ghost"
              className={`flex items-center space-x-2 px-4 py-3 rounded-none transition-colors ${
                pathname === "/reports/new"
                  ? "bg-blue-900 border-b-2 border-white text-white"
                  : "hover:bg-blue-600 text-white"
              }`}
            >
              <Link href="/reports/new">
                <Plus className="h-4 w-4" />
                <span>Tambah Laporan</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
