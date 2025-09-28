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
  monthFilter?: string
}

export const exportToExcel = (reports: any[], options: ExportOptions) => {
  const wb = XLSX.utils.book_new()
  const data: any[] = []

  // Judul
  data.push(["LAPORAN TD PENYIARAN"])
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
  const header2 = [
    "", "", "",
    "Video", "Audio",
    "",
    "",
    "Masalah", "Penanganan",
    "",
  ]

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

  // Tambahkan 3 baris kosong antara tabel dan tanda tangan
  data.push([])
  data.push([])
  data.push([])

const ttdStartRow = data.length

// Bagian tanda tangan dengan jarak yang lebih besar
data.push([
  "Ketua Tim Produksi dan Penyiaran,", "", "", "", "",
  `Mataram, ${new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })}`, "", "", "", "",
])

data.push([
  "", "", "", "", "",
  "Pengarah Teknik,", "", "", "", "",
])

// Tambahkan 4 baris kosong untuk ruang tanda tangan
data.push(["", "", "", "", "", "", "", "", "", ""])
data.push(["", "", "", "", "", "", "", "", "", ""])
data.push(["", "", "", "", "", "", "", "", "", ""])
data.push(["", "", "", "", "", "", "", "", "", ""])

data.push([
  options.kepalaName || "________________", "", "", "", "",
  `${options?.currentUser?.name || "________________" }`, "", "", "", "",
])

data.push([
  `NIP. ${options.kepalaNIP || "________________"}`, "", "", "", "",
  `NIP. ${options?.currentUser?.nip || "________________" }`, "", "", "", "",
])

const ws = XLSX.utils.aoa_to_sheet(data)

// Update merge cells untuk layout baru dengan baris tambahan
ws["!merges"] = [
  { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }, // Judul

  { s: { r: 2, c: 3 }, e: { r: 2, c: 4 } }, // Kualitas Siaran
  { s: { r: 2, c: 7 }, e: { r: 2, c: 8 } }, // Kendala Siaran

  { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } }, // NO
  { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } }, // Tanggal
  { s: { r: 2, c: 2 }, e: { r: 3, c: 2 } }, // Petugas
  { s: { r: 2, c: 5 }, e: { r: 3, c: 5 } }, // Jam Siaran
  { s: { r: 2, c: 6 }, e: { r: 3, c: 6 } }, // Program
  { s: { r: 2, c: 9 }, e: { r: 3, c: 9 } }, // Keterangan

  // tanda tangan (merge kiri-kanan biar rapi)
  { s: { r: ttdStartRow, c: 0 }, e: { r: ttdStartRow, c: 4 } },
  { s: { r: ttdStartRow, c: 5 }, e: { r: ttdStartRow, c: 9 } },
  { s: { r: ttdStartRow + 1, c: 0 }, e: { r: ttdStartRow + 1, c: 4 } },
  { s: { r: ttdStartRow + 1, c: 5 }, e: { r: ttdStartRow + 1, c: 9 } },
  { s: { r: ttdStartRow + 6, c: 0 }, e: { r: ttdStartRow + 6, c: 4 } },
  { s: { r: ttdStartRow + 6, c: 5 }, e: { r: ttdStartRow + 6, c: 9 } },
  { s: { r: ttdStartRow + 7, c: 0 }, e: { r: ttdStartRow + 7, c: 4 } },
  { s: { r: ttdStartRow + 7, c: 5 }, e: { r: ttdStartRow + 7, c: 9 } },
]

  // Lebar kolom
  ws["!cols"] = [
    { wch: 5 },
    { wch: 20 },
    { wch: 18 },
    { wch: 10 },
    { wch: 10 },
    { wch: 18 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 22 },
  ]

  // Style judul
  const titleCell = ws["A1"]
  if (titleCell) {
    titleCell.s = {
      font: { bold: true, size: 14 },
      alignment: { horizontal: "center", vertical: "center" },
    }
  }

  // Style header
  for (let R = 2; R <= 3; R++) {
    for (let C = 0; C <= 9; C++) {
      const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })]
      if (cell) {
        cell.s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "192D74" } },
          alignment: { horizontal: "center", vertical: "center", wrapText: true },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        }
      }
    }
  }

  // Style data
  const dataStartRow = 4
  for (let R = dataStartRow; R < dataStartRow + reports.length; R++) {
    for (let C = 0; C <= 9; C++) {
      const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })]
      if (cell) {
        cell.s = {
          alignment: {
            horizontal: [7, 8, 9].includes(C) ? "left" : "center",
            vertical: "center",
            wrapText: true,
          },
          border: {
            top: { style: "thin", color: { rgb: "D3D3D3" } },
            bottom: { style: "thin", color: { rgb: "D3D3D3" } },
            left: { style: "thin", color: { rgb: "D3D3D3" } },
            right: { style: "thin", color: { rgb: "D3D3D3" } },
          },
        }
      }
    }
  }

  // Style tanda tangan - update untuk baris yang baru
  for (let R = ttdStartRow; R <= ttdStartRow + 1; R++) {
    const leftCell = ws[XLSX.utils.encode_cell({ r: R, c: 0 })]
    const rightCell = ws[XLSX.utils.encode_cell({ r: R, c: 5 })]
    if (leftCell) {
      leftCell.s = {
        alignment: { horizontal: "center", vertical: "top", wrapText: true },
        font: { bold: R === ttdStartRow },
      }
    }
    if (rightCell) {
      rightCell.s = {
        alignment: { horizontal: "center", vertical: "top", wrapText: true },
        font: { bold: R === ttdStartRow || R === ttdStartRow + 1 },
      }
    }
  }

  // Style untuk nama dan NIP
  for (let R = ttdStartRow + 6; R <= ttdStartRow + 7; R++) {
    const leftCell = ws[XLSX.utils.encode_cell({ r: R, c: 0 })]
    const rightCell = ws[XLSX.utils.encode_cell({ r: R, c: 5 })]
    if (leftCell) {
      leftCell.s = {
        alignment: { horizontal: "center", vertical: "top", wrapText: true },
        font: { bold: false },
      }
    }
    if (rightCell) {
      rightCell.s = {
        alignment: { horizontal: "center", vertical: "top", wrapText: true },
        font: { bold: false },
      }
    }
  }

  // Simpan file
  XLSX.utils.book_append_sheet(wb, ws, "Laporan TD")
  XLSX.writeFile(wb, `Laporan_TD_${options.monthFilter || "Semua"}.xlsx`)
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
    monthFilter,
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
  doc.text(
    `Periode: ${getMonthName(monthFilter) || "Semua Data"}`,
    14,
    30
  )
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

  const pageWidth = doc.internal.pageSize.getWidth() - 20

  // Data
  const tableData = reports.map((r, idx) => [
    idx + 1,
    new Date(r.tanggal).toLocaleDateString("id-ID", {
      weekday: "long", day: "numeric", month: "short", year: "numeric",
    }),
    r.petugas.join("/"),
    r.kualitas_video || "-",
    r.kualitas_audio || "-",
    `${r.jam_mulai}-${r.jam_selesai}`,
    r.program || "-",
    r.kendala || "Siaran lancar",
    r.penanganan || "-",
    r.keterangan || "-",
  ])

  autoTable(doc, {
    startY: 40,
    theme: "grid",
    tableWidth: pageWidth,
    styles: { fontSize: 8, halign: "center", valign: "middle" },
    headStyles: { fillColor: [25, 45, 116], textColor: 255 },
    head: [
      [
        { content: "NO", rowSpan: 2 },
        { content: "Tanggal/Hari", rowSpan: 2 },
        { content: "Petugas TD", rowSpan: 2 },
        { content: "Kualitas Siaran", colSpan: 2 },
        { content: "Jam Siaran", rowSpan: 2 },
        { content: "Program Siaran", rowSpan: 2 },
        { content: "Kendala Siaran", colSpan: 2 },
        { content: "Keterangan", rowSpan: 2 },
      ],
      [
        { content: "Video" },
        { content: "Audio" },
        { content: "Masalah" },
        { content: "Penanganan" },
      ],
    ],
    body: tableData,
  })

  const finalY = (doc as any).lastAutoTable.finalY
  addSignatureSection(doc, currentUser, kepalaName, kepalaNIP, finalY + 20, pageWidth)

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