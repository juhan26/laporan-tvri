// user-form.tsx (updated)
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserFormProps {
  onSuccess: () => void
}

export function UserForm({ onSuccess }: UserFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    jabatan: "",
    username: "",
    email: "",
    password: "",
    role: "operator",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Create user in Supabase Auth with additional metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
          data: {
            name: formData.name,
            username: formData.username,
            nik: formData.nik,
            jabatan: formData.jabatan,
            role: formData.role,
          }
        },
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error("Failed to create user")
      }

      // Trigger akan otomatis membuat record di tabel users
      // Tunggu sebentar untuk memastikan trigger selesai
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verifikasi bahwa user profile sudah dibuat
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single()

      if (profileError) {
        console.warn("Profile might not be created yet:", profileError)
        // Lanjutkan saja, karena trigger akan membuatnya nanti
      }

      onSuccess()

      // Reset form
      setFormData({
        name: "",
        nik: "",
        jabatan: "",
        username: "",
        email: "",
        password: "",
        role: "operator",
      })

      router.push('/dashboard');
    } catch (error: any) {
      console.error("Error creating user:", error)
      setError(error.message || "Terjadi kesalahan saat membuat user")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="name">Nama User</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Masukkan nama lengkap"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nik">NIK</Label>
        <Input
          id="nik"
          type="text"
          value={formData.nik}
          onChange={(e) => handleInputChange("nik", e.target.value)}
          placeholder="Masukkan NIK (16 digit)"
          maxLength={16}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jabatan">Jabatan</Label>
        <Input
          id="jabatan"
          type="text"
          value={formData.jabatan}
          onChange={(e) => handleInputChange("jabatan", e.target.value)}
          placeholder="Masukkan jabatan"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) => handleInputChange("username", e.target.value)}
          placeholder="Masukkan username"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Masukkan email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          placeholder="Masukkan password"
          required
          minLength={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="operator">Operator</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess} disabled={loading}>
          Batal
        </Button>
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Membuat...
            </>
          ) : (
            "Buat User"
          )}
        </Button>
      </div>
    </form>
  )
}