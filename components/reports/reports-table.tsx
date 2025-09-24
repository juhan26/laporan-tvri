"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download } from "lucide-react"
import { exportToExcel, exportToPDF, getKepalaData } from "@/lib/export-utils"
import type { BroadcastReport } from "@/lib/types"

interface ReportsTableProps {
  reports: BroadcastReport[]
  onReportsChange: () => void
}

export function ReportsTable({ reports, onReportsChange }: ReportsTableProps) {
  const { userProfile } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const canEdit = userProfile?.role === "admin"
  const canDelete = userProfile?.role === "admin"

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.kendala && report.kendala.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesDate = !filterDate || report.tanggal === filterDate
    return matchesSearch && matchesDate
  })

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("broadcast_reports").delete().eq("id", id)

      if (error) throw error

      onReportsChange()
    } catch (error) {
      console.error("Error deleting report:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  // PERBAIKAN: Fungsi export yang benar
  const handleExportToPDF = () => {
    try {
      const kepalaData = getKepalaData()
      exportToPDF(filteredReports, {
        currentUser: userProfile || undefined,
        kepalaName: kepalaData.name,
        kepalaNIP: kepalaData.nip
      })
    } catch (error) {
      console.error("Error exporting to PDF:", error)
      alert("Terjadi kesalahan saat mengekspor ke PDF")
    }
  }

  const handleExportToExcel = () => {
    try {
      const kepalaData = getKepalaData()
      exportToExcel(filteredReports, {
        currentUser: userProfile || undefined,
        kepalaName: kepalaData.name,
        kepalaNIP: kepalaData.nip
      })
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Terjadi kesalahan saat mengekspor ke Excel")
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-blue-800">Laporan TD Penyiaran</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 border">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Cari laporan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 border">
            <Filter className="h-4 w-4 text-gray-500" />
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border-none shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="flex space-x-2">
            {/* PERBAIKAN: Gunakan fungsi yang benar */}
            <Button onClick={handleExportToExcel} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>

            <Button onClick={handleExportToPDF} className="bg-red-600 hover:bg-red-700">
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-800 hover:bg-blue-800">
                <TableHead className="text-white text-center border-r border-blue-700" rowSpan={2}>
                  NO
                </TableHead>
                <TableHead className="text-white text-center border-r border-blue-700" rowSpan={2}>
                  Tanggal/Hari
                </TableHead>
                <TableHead className="text-white text-center border-r border-blue-700" rowSpan={2}>
                  Petugas TD
                </TableHead>
                <TableHead className="text-white text-center border-r border-blue-700" colSpan={2}>
                  Kualitas Siaran
                </TableHead>
                <TableHead className="text-white text-center border-r border-blue-700" colSpan={2}>
                  Kendala siaran
                </TableHead>
                <TableHead className="text-white text-center border-r border-blue-700" rowSpan={2}>
                  Penanganan
                </TableHead>
                <TableHead className="text-white text-center" rowSpan={2}>
                  Keterangan
                </TableHead>
              </TableRow>
              <TableRow className="bg-blue-800 hover:bg-blue-800">
                <TableHead className="text-white text-center border-r border-blue-700">Video</TableHead>
                <TableHead className="text-white text-center border-r border-blue-700">Audio</TableHead>
                <TableHead className="text-white text-center border-r border-blue-700">Jam</TableHead>
                <TableHead className="text-white text-center border-r border-blue-700">Masalah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report, index) => (
                <TableRow key={report.id} className="hover:bg-gray-50">
                  <TableCell className="text-center border-r">{index + 1}</TableCell>
                  <TableCell className="border-r">
                    {new Date(report.tanggal).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="border-r">{report.petugas.join("/")}</TableCell>
                  <TableCell className="border-r text-sm">{report.kualitas_video || "-"}</TableCell>
                  <TableCell className="border-r text-sm">{report.kualitas_audio || "-"}</TableCell>
                  <TableCell className="text-center border-r">
                    {report.jam_mulai}-{report.jam_selesai}
                  </TableCell>
                  <TableCell className="border-r">{report.kendala || "Siaran lancar"}</TableCell>
                  <TableCell className="border-r">{report.penanganan || "-"}</TableCell>
                  <TableCell>{report.keterangan || ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || filterDate ? "Tidak ada laporan yang sesuai dengan filter" : "Belum ada laporan"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}