"use client"

import { useState } from "react"
import { UsersTable } from "@/components/users/users-table"
import { UserForm } from "@/components/users/user-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-provider"
import { redirect } from "next/navigation"

export default function UsersPage() {
  const [showAddUser, setShowAddUser] = useState(false)
  const { userProfile, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!userProfile || userProfile.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Kelola User</h1>
        <p className="text-gray-600 mt-2">Kelola user dan hak akses dalam sistem</p>
      </div>

      <UsersTable onAddUser={() => setShowAddUser(true)} />

      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah User Baru</DialogTitle>
          </DialogHeader>
          <UserForm onSuccess={() => setShowAddUser(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
