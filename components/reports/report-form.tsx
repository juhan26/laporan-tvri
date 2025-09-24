"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface ReportFormProps {
  initialData?: any
  isEditing?: boolean
}

interface FormData {
  tanggal: string
  jam_mulai: string
  jam_selesai: string
  program: string
  kualitas_video: string
  kualitas_audio: string
  petugas: string[]
  kendala: string
  penanganan: string
  keterangan: string
}

export function ReportForm({ initialData, isEditing = false }: ReportFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [petugasOptions, setPetugasOptions] = useState<string[]>([])

  const [formData, setFormData] = useState<FormData>({
    tanggal: initialData?.tanggal || new Date().toISOString().split('T')[0],
    jam_mulai: initialData?.jam_mulai || "",
    jam_selesai: initialData?.jam_selesai || "",
    program: initialData?.program || "",
    kualitas_video: initialData?.kualitas_video || "",
    kualitas_audio: initialData?.kualitas_audio || "",
    petugas: initialData?.petugas || [],
    kendala: initialData?.kendala || "",
    penanganan: initialData?.penanganan || "",
    keterangan: initialData?.keterangan || "",
  })

  // Fetch semua user dari Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("users")
        .select("name")

      if (error) {
        console.error("Gagal mengambil user:", error)
      } else {
        const names = data.map((user: any) => user.name)
        setPetugasOptions(names)
      }
    }

    fetchUsers()
  }, [])

  const handlePetugasChange = (petugasName: string, checked: boolean) => {
    if (checked && formData.petugas.length >= 2) {
      setError("Maksimal 2 petugas dapat dipilih")
      return
    }

    setFormData((prev) => ({
      ...prev,
      petugas: checked
        ? [...prev.petugas, petugasName]
        : prev.petugas.filter((p) => p !== petugasName),
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validasi
    if (formData.petugas.length === 0) {
      setError("Pilih minimal 1 petugas")
      setIsLoading(false)
      return
    }

    if (!formData.tanggal || !formData.jam_mulai || !formData.jam_selesai || !formData.program) {
      setError("Mohon lengkapi semua field yang wajib diisi")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      if (!user) {
        throw new Error("User tidak ditemukan. Silakan login ulang.")
      }

      const reportData = {
        tanggal: formData.tanggal,
        jam_mulai: formData.jam_mulai,
        jam_selesai: formData.jam_selesai,
        program: formData.program.trim(),
        kualitas_video: formData.kualitas_video.trim(),
        kualitas_audio: formData.kualitas_audio.trim(),
        petugas: formData.petugas,
        kendala: formData.kendala.trim(),
        penanganan: formData.penanganan.trim(),
        keterangan: formData.keterangan.trim(),
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      let result
      if (isEditing && initialData) {
        result = await supabase
          .from("broadcast_reports")
          .update(reportData)
          .eq("id", initialData.id)
          .select()
      } else {
        result = await supabase
          .from("broadcast_reports")
          .insert([reportData])
          .select()
      }

      if (result.error) {
        throw new Error(result.error.message)
      }

      // Redirect ke halaman laporan
      router.push("/reports")
      router.refresh()

    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan saat menyimpan laporan")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTextareaChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-800">
          {isEditing ? "Edit Laporan Siaran" : "Tambah Laporan Siaran"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal Siaran *</Label>
              <Input
                id="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={(e) => handleInputChange("tanggal", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="program">Program Siaran *</Label>
              <Input
                id="program"
                type="text"
                placeholder="Nama program siaran"
                value={formData.program}
                onChange={(e) => handleInputChange("program", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jam_mulai">Jam Mulai *</Label>
              <Input
                id="jam_mulai"
                type="time"
                value={formData.jam_mulai}
                onChange={(e) => handleInputChange("jam_mulai", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jam_selesai">Jam Selesai *</Label>
              <Input
                id="jam_selesai"
                type="time"
                value={formData.jam_selesai}
                onChange={(e) => handleInputChange("jam_selesai", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="kualitas_video">Kualitas Video</Label>
              <Textarea
                id="kualitas_video"
                placeholder="Deskripsikan kualitas video..."
                value={formData.kualitas_video}
                onChange={handleTextareaChange("kualitas_video")}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kualitas_audio">Kualitas Audio</Label>
              <Textarea
                id="kualitas_audio"
                placeholder="Deskripsikan kualitas audio..."
                value={formData.kualitas_audio}
                onChange={handleTextareaChange("kualitas_audio")}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Petugas (Pilih 1–2 petugas) *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {petugasOptions.map((petugas) => (
                <div key={petugas} className="flex items-center space-x-2 bg-gray-50 p-3 rounded">
                  <Checkbox
                    id={petugas}
                    checked={formData.petugas.includes(petugas)}
                    onCheckedChange={(checked) => handlePetugasChange(petugas, checked as boolean)}
                  />
                  <Label htmlFor={petugas}>{petugas}</Label>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Terpilih: {formData.petugas.length}/2</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kendala">Kendala Teknis</Label>
            <Textarea
              id="kendala"
              placeholder="Deskripsikan kendala teknis yang terjadi..."
              value={formData.kendala}
              onChange={handleTextareaChange("kendala")}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="penanganan">Penanganan</Label>
            <Textarea
              id="penanganan"
              placeholder="Langkah penanganan yang dilakukan..."
              value={formData.penanganan}
              onChange={handleTextareaChange("penanganan")}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keterangan">Keterangan</Label>
            <Textarea
              id="keterangan"
              placeholder="Keterangan tambahan..."
              value={formData.keterangan}
              onChange={handleTextareaChange("keterangan")}
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-4">
            <Button type="submit" className="bg-blue-800 hover:bg-blue-900" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Saving..."}
                </>
              ) : isEditing ? (
                "Update Laporan"
              ) : (
                "Simpan Laporan"
              )}
            </Button>

            <Button type="button" variant="outline" onClick={() => router.push("/reports")}>
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
