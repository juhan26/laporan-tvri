"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import type { BroadcastReport, ReportForm as ReportFormType } from "@/lib/types"

interface ReportFormProps {
  initialData?: BroadcastReport
  isEditing?: boolean
}

const PETUGAS_OPTIONS = ["Bagus", "Alan", "Hafiz", "Dedi", "Sari", "Budi"]

export function ReportForm({ initialData, isEditing = false }: ReportFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<ReportFormType>({
    tanggal: initialData?.tanggal || "",
    jam_mulai: initialData?.jam_mulai || "",
    jam_selesai: initialData?.jam_selesai || "",
    program: initialData?.program || "",
    kualitas_video: initialData?.kualitas_video || "Baik",
    kualitas_audio: initialData?.kualitas_audio || "Baik",
    petugas: initialData?.petugas || [],
    kendala: initialData?.kendala || "",
    penanganan: initialData?.penanganan || "",
    keterangan: initialData?.keterangan || "",
  })

  const handlePetugasChange = (petugasName: string, checked: boolean) => {
    if (checked && formData.petugas.length >= 2) {
      setError("Maksimal 2 petugas dapat dipilih")
      return
    }

    setFormData((prev) => ({
      ...prev,
      petugas: checked ? [...prev.petugas, petugasName] : prev.petugas.filter((p) => p !== petugasName),
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validation
    if (formData.petugas.length === 0 || formData.petugas.length > 2) {
      setError("Pilih minimal 1 dan maksimal 2 petugas")
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

      const reportData = {
        tanggal: formData.tanggal,
        jam_mulai: formData.jam_mulai,
        jam_selesai: formData.jam_selesai,
        program: formData.program,
        kualitas_video: formData.kualitas_video,
        kualitas_audio: formData.kualitas_audio,
        petugas: formData.petugas,
        kendala: formData.kendala,
        penanganan: formData.penanganan,
        keterangan: formData.keterangan,
        created_by: user?.id,
      }

      if (isEditing && initialData) {
        const { error } = await supabase.from("broadcast_reports").update(reportData).eq("id", initialData.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("broadcast_reports").insert([reportData])

        if (error) throw error
      }

      router.push("/reports")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
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
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jam_mulai">Jam Mulai *</Label>
              <Input
                id="jam_mulai"
                type="time"
                value={formData.jam_mulai}
                onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jam_selesai">Jam Selesai *</Label>
              <Input
                id="jam_selesai"
                type="time"
                value={formData.jam_selesai}
                onChange={(e) => setFormData({ ...formData, jam_selesai: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Kualitas Video *</Label>
              <RadioGroup
                value={formData.kualitas_video}
                onValueChange={(value: "Baik" | "Tidak Baik") => setFormData({ ...formData, kualitas_video: value })}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Baik" id="video-baik" />
                  <Label htmlFor="video-baik" className="text-green-600 font-semibold">
                    Baik
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Tidak Baik" id="video-tidak-baik" />
                  <Label htmlFor="video-tidak-baik" className="text-red-600 font-semibold">
                    Tidak Baik
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Kualitas Audio *</Label>
              <RadioGroup
                value={formData.kualitas_audio}
                onValueChange={(value: "Baik" | "Tidak Baik") => setFormData({ ...formData, kualitas_audio: value })}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Baik" id="audio-baik" />
                  <Label htmlFor="audio-baik" className="text-green-600 font-semibold">
                    Baik
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Tidak Baik" id="audio-tidak-baik" />
                  <Label htmlFor="audio-tidak-baik" className="text-red-600 font-semibold">
                    Tidak Baik
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Petugas (Pilih 1-2 petugas) *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PETUGAS_OPTIONS.map((petugas) => (
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
              onChange={(e) => setFormData({ ...formData, kendala: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="penanganan">Penanganan</Label>
            <Textarea
              id="penanganan"
              placeholder="Langkah penanganan yang dilakukan..."
              value={formData.penanganan}
              onChange={(e) => setFormData({ ...formData, penanganan: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keterangan">Keterangan</Label>
            <Textarea
              id="keterangan"
              placeholder="Keterangan tambahan..."
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
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
