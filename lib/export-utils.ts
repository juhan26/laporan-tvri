// lib/export-utils.ts
import * as XLSX from "xlsx-js-style"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { BroadcastReport, User } from "./types"

interface ExportOptions {
  filename?: string
  currentUser?: User | null
  kepalaName?: string
  kepalaNIP?: string
  dateRange?: string
}

export const exportToExcel = (reports: any[], options: ExportOptions) => {
  const wb = XLSX.utils.book_new()
  const data: any[] = []

  // Judul
  data.push(["LAPORAN TD PENYIARAN"])
  data.push([options.dateRange ? `Periode: ${options.dateRange}` : "Semua Data"]) // 🔹 tampilkan periode
  data.push([])

  // Header utama + sub-header
  const header1 = [
    "NO",
    "Tanggal/Hari",
    "Petugas TD",
    "Kualitas Siaran",
    "",
    "Jam Siaran",
    "Program Siaran",
    "Kendala Siaran",
    "",
    "Keterangan",
  ]
  const header2 = ["", "", "", "Video", "Audio", "", "", "Masalah", "Penanganan", ""]

  data.push(header1)
  data.push(header2)

  // Data isi tabel
  reports.forEach((r, idx) => {
    data.push([
      idx + 1,
      new Date(r.tanggal).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      Array.isArray(r.petugas) ? r.petugas.join("/") : r.petugas,
      r.kualitas_video || "-",
      r.kualitas_audio || "-",
      `${r.jam_mulai}-${r.jam_selesai}`,
      r.program || "-",
      r.kendala || "Siaran lancar",
      r.penanganan || "-",
      r.keterangan || "",
    ])
  })

  // Buat worksheet
  const ws = XLSX.utils.aoa_to_sheet(data)

  // Tambah ke workbook
  XLSX.utils.book_append_sheet(wb, ws, "Laporan TD")

  // Save
  XLSX.writeFile(wb, `Laporan_TD_${options.dateRange || "Semua"}.xlsx`)
}

// =============================
// EXPORT TO PDF
// =============================
export function exportToPDF(
  reports: BroadcastReport[],
  options: ExportOptions = {}
) {
  const {
    filename = "laporan-td-penyiaran",
    currentUser = null,
    kepalaName = "________________",
    kepalaNIP = "________________",
    dateRange,   // 🔹 pakai dateRange
  } = options

  const doc = new jsPDF("landscape", "mm", "a4")

  // Judul
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text(
    "LAPORAN TD PENYIARAN - TVRI",
    doc.internal.pageSize.getWidth() / 2,
    20,
    { align: "center" }
  )

  // Periode & Tanggal Cetak
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Periode: ${dateRange || "Semua Data"}`, 14, 30) // 🔹 pakai dateRange
  doc.text(
    `Dicetak pada: ${new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`,
    doc.internal.pageSize.getWidth() - 14,
    30,
    { align: "right" }
  )

  // Data untuk tabel
  const tableData = reports.map((r, idx) => [
    idx + 1,
    new Date(r.tanggal).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    Array.isArray(r.petugas) ? r.petugas.join("/") : r.petugas,
    r.kualitas_video || "-",
    r.kualitas_audio || "-",
    `${r.jam_mulai}-${r.jam_selesai}`,
    r.program || "-",
    r.kendala || "Siaran lancar",
    r.penanganan || "-",
    r.keterangan || "",
  ])

  // Tabel
  autoTable(doc, {
    head: [
      [
        "NO",
        "Tanggal/Hari",
        "Petugas TD",
        { content: "Kualitas Siaran", colSpan: 2, styles: { halign: "center" } },
        "Jam Siaran",
        "Program Siaran",
        { content: "Kendala Siaran", colSpan: 2, styles: { halign: "center" } },
        "Keterangan",
      ],
      ["", "", "", "Video", "Audio", "", "", "Masalah", "Penanganan", ""],
    ],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 },
    theme: "grid",
  })

  // Tanda tangan
  const finalY = (doc as any).lastAutoTable.finalY + 20
  doc.text("Mengetahui,", 14, finalY)
  doc.text("Petugas TD,", doc.internal.pageSize.getWidth() - 60, finalY)

  doc.text(kepalaName, 14, finalY + 30)
  doc.text(`NIP. ${kepalaNIP}`, 14, finalY + 35)

  if (currentUser) {
    doc.text(currentUser.name, doc.internal.pageSize.getWidth() - 60, finalY + 30)
    if (currentUser.nip) {
      doc.text(`NIP. ${currentUser.nip}`, doc.internal.pageSize.getWidth() - 60, finalY + 35)
    }
  }

  // Save file
  const currentDate = new Date().toISOString().split("T")[0]
  doc.save(`${filename}-${currentDate}.pdf`)
}

// =============================
// SIGNATURE SECTION (PDF) - Updated with proper spacing
// =============================
function addSignatureSection(
  doc: jsPDF,
  currentUser: User | null,
  kepalaName: string,
  kepalaNIP: string,
  startY: number,
  pageWidth: number
) {
  const userName = currentUser?.name || "________________"
  const userNip = currentUser?.nip || "________________"
  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  // KIRI: Ketua Tim Produksi dan Penyiaran
  doc.text("Ketua Tim Produksi dan Penyiaran,", 30, startY)

  // KANAN: Tanggal dan Pengarah Teknik
  const rightX = pageWidth - 80
  doc.text(`Mataram, ${currentDate}`, rightX, startY)
  doc.text("Pengarah Teknik,", rightX, startY + 7)

  // Tambahkan jarak kosong untuk tanda tangan (4 baris @ 7mm spacing)
  const signatureSpacing = 28 // 4 baris x 7mm = 28mm

  // KIRI: Nama dan NIP Ketua (setelah jarak kosong)
  doc.text(kepalaName, 30, startY + signatureSpacing)
  doc.text(`NIP. ${kepalaNIP}`, 30, startY + signatureSpacing + 7)

  // KANAN: Nama dan NIP Pengarah Teknik (setelah jarak kosong)
  doc.text(userName, rightX, startY + signatureSpacing)
  doc.text(`NIP. ${userNip}`, rightX, startY + signatureSpacing + 7)
}

// =============================
// UTILS
// =============================
function getMonthName(monthString?: string): string {
  if (!monthString) return ""
  try {
    const [year, month] = monthString.split("-")
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" })
  } catch {
    return monthString
  }
}

export function getKepalaData() {
  return {
    name: process.env.NEXT_PUBLIC_KEPALA_NAME || "Bagus Eko Saputro, S.E",
    nip: process.env.NEXT_PUBLIC_KEPALA_NIP || "19651231 199203 1 001",
  }
}