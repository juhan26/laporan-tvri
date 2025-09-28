"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download, Calendar } from "lucide-react"
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
  const [filterMonth, setFilterMonth] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const canEdit = userProfile?.role === "admin"
  const canDelete = userProfile?.role === "admin"

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.kendala && report.kendala.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesMonth = !filterMonth ||
      report.tanggal.startsWith(filterMonth)

    return matchesSearch && matchesMonth
  })

  const getMonthName = (monthString: string) => {
    if (!monthString) return "Semua Bulan"
    const [year, month] = monthString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  }

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

  // Fungsi export dengan filter bulan
  // Tambahkan fungsi handleExportToPDF yang diperbaiki
  const handleExportToPDF = () => {
    try {
      // Pastikan ada data yang akan di-export
      if (filteredReports.length === 0) {
        alert("Tidak ada data untuk diexport. Silakan sesuaikan filter Anda.")
        return
      }

      console.log("Memulai export PDF dengan data:", filteredReports.length)

      const kepalaData = getKepalaData()
      exportToPDF(filteredReports, {
        currentUser: userProfile || undefined,
        kepalaName: kepalaData.name,
        kepalaNIP: kepalaData.nip,
        monthFilter: filterMonth
      })
    } catch (error) {
      console.error("Error exporting to PDF:", error)
      alert("Terjadi kesalahan saat mengekspor ke PDF. Pastikan data valid.")
    }
  }

  const handleExportToExcel = () => {
    try {
      const kepalaData = getKepalaData()
      exportToExcel(filteredReports, {
        currentUser: userProfile || undefined,
        kepalaName: kepalaData.name,
        kepalaNIP: kepalaData.nip,
        monthFilter: filterMonth
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
        <h2 className="text-2xl font-bold text-[#192d74]">Laporan TD Penyiaran</h2>

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
            <Calendar className="h-4 w-4 text-gray-500" />
            <Input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="border-none shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="flex space-x-2">
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

      {/* Info Filter */}
      {filterMonth && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-[#192d74] text-sm">
            Menampilkan laporan untuk: <strong>{getMonthName(filterMonth)}</strong>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-[#192d74] hover:text-blue-800"
              onClick={() => setFilterMonth("")}
            >
              Hapus Filter
            </Button>
          </p>
        </div>
      )}

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#192d74] hover:bg-blue-800">
                <TableHead className="text-white text-center border-r border-white" rowSpan={2}>
                  NO
                </TableHead>
                <TableHead className="text-white text-center border-r border-white" rowSpan={2}>
                  Tanggal/Hari
                </TableHead>
                <TableHead className="text-white text-center border-r border-white" rowSpan={2}>
                  Petugas TD
                </TableHead>
                <TableHead className="text-white text-center border-r border-white" colSpan={2}>
                  Kualitas Siaran
                </TableHead>
                <TableHead className="text-white text-center border-r border-white" colSpan={2}>
                  Kendala siaran
                </TableHead>
                <TableHead className="text-white text-center border-r border-white" rowSpan={2}>
                  Penanganan
                </TableHead>
                <TableHead className="text-white text-center" rowSpan={2}>
                  Keterangan
                </TableHead>
              </TableRow>
              <TableRow className="bg-[#192d74] hover:bg-blue-800">
                <TableHead className="text-white text-center border-r border-white">Video</TableHead>
                <TableHead className="text-white text-center border-r border-white">Audio</TableHead>
                <TableHead className="text-white text-center border-r border-white">Jam</TableHead>
                <TableHead className="text-white text-center border-r border-white">Masalah</TableHead>
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
              {searchTerm || filterMonth ? "Tidak ada laporan yang sesuai dengan filter" : "Belum ada laporan"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}