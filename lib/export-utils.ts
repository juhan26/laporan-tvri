// lib/export-utils.ts
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { BroadcastReport, User } from "./types"

// Simple type declaration
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
    lastAutoTable?: {
      finalY: number
    }
  }
}

// Apply plugin
(jsPDF as any).autoTable = autoTable

interface ExportOptions {
  filename?: string
  currentUser?: User | null
  kepalaName?: string
  kepalaNIP?: string
}

export function exportToExcel(
  reports: BroadcastReport[],
  options: ExportOptions = {}
) {
  const {
    filename = "laporan-td-penyiaran",
    currentUser
  } = options

  const excelData = reports.map((report, index) => ({
    No: index + 1,
    "Tanggal/Hari": new Date(report.tanggal).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    "Petugas TD": report.petugas.join("/"),
    "Kualitas Video": report.kualitas_video || "-",
    "Kualitas Audio": report.kualitas_audio || "-",
    "Jam Siaran": `${report.jam_mulai}-${report.jam_selesai}`,
    "Program Siaran": report.program || "-",
    "Kendala/Masalah": report.kendala || "Siaran lancar",
    "Penanganan": report.penanganan || "-",
    "Keterangan": report.keterangan || "-",
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(excelData)

  const colWidths = [
    { wch: 5 }, { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
    { wch: 15 }, { wch: 30 }, { wch: 40 }, { wch: 30 }, { wch: 30 },
  ]
  ws["!cols"] = colWidths

  XLSX.utils.book_append_sheet(wb, ws, "Laporan TD Penyiaran")

  const ttdData = [
    ["", "", ""], ["", "", ""], ["MENGETAHUI:", "", ""],
    ["KETUA", "", "PETUGAS TD"], ["", "", ""], ["", "", ""],
    ["", "", `(${currentUser?.name || "________________"})`],
    ["", "", `NIP: ${currentUser?.nip || "________________"}`],
    ["", "", ""], ["", "", ""], ["(________________)", "", ""],
    [`NIP: ${options.kepalaNIP || "________________"}`, "", ""],
  ]

  const ttdWs = XLSX.utils.aoa_to_sheet(ttdData)
  ttdWs["!cols"] = [{ wch: 30 }, { wch: 10 }, { wch: 30 }]
  XLSX.utils.book_append_sheet(wb, ttdWs, "Tanda Tangan")

  const currentDate = new Date().toISOString().split("T")[0]
  const finalFilename = `${filename}-${currentDate}.xlsx`
  XLSX.writeFile(wb, finalFilename)
}

export function exportToPDF(
  reports: BroadcastReport[],
  options: ExportOptions = {}
) {
  try {
    const {
      filename = "laporan-td-penyiaran",
      currentUser,
      kepalaName = "________________",
      kepalaNIP = "________________"
    } = options

    // Create PDF document
    const doc = new jsPDF("portrait", "mm", "a4")
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Header
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("LAPORAN TD PENYIARAN", pageWidth / 2, 20, { align: "center" })
    
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("TVRI", pageWidth / 2, 28, { align: "center" })

    // Date info
    const currentDate = new Date().toLocaleDateString("id-ID", {
      year: "numeric", month: "long", day: "numeric",
    })
    doc.setFontSize(10)
    doc.text(`Dicetak pada: ${currentDate}`, pageWidth - 20, 35, { align: "right" })

    // Prepare table data
    const tableData: string[][] = reports.map((report, index) => {
      return [
        (index + 1).toString(),
        new Date(report.tanggal).toLocaleDateString("id-ID", {
          weekday: "long", day: "numeric", month: "short", year: "numeric",
        }),
        report.petugas.join("/") || "-",
        report.kualitas_video || "Baik",
        report.kualitas_audio || "Baik",
        report.jam_mulai && report.jam_selesai ? `${report.jam_mulai}-${report.jam_selesai}` : "-",
        report.kendala || "Siaran lancar",
        report.keterangan || "-",
      ]
    });

    // Create table dengan autoTable
    (doc as any).autoTable({
      head: [["NO", "Tanggal/Hari", "Petugas TD", "Video", "Audio", "Jam", "Kendala", "Keterangan"]],
      body: tableData,
      startY: 40,
      styles: { 
        fontSize: 8, 
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [30, 58, 138],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 25 },
        2: { cellWidth: 20 },
        3: { cellWidth: 18 },
        4: { cellWidth: 18 },
        5: { cellWidth: 20 },
        6: { cellWidth: 45 },
        7: { cellWidth: 30 },
      },
      margin: { top: 40, right: 10, bottom: 60, left: 10 },
    })

    // PERBAIKAN: Gunakan type assertion untuk lastAutoTable
    const finalY = (doc as any).lastAutoTable?.finalY || 150

    // Tambahkan TTD section
    addSignatureSection(doc, currentUser, kepalaName, kepalaNIP, finalY + 10)

    // Save PDF
    const currentDateString = new Date().toISOString().split("T")[0]
    const finalFilename = `${filename}-${currentDateString}.pdf`
    doc.save(finalFilename)

  } catch (error) {
    console.error("Error generating PDF:", error)
    alert("Terjadi kesalahan saat membuat PDF. Pastikan data valid.")
  }
}

// Function untuk menambahkan section TTD
function addSignatureSection(
  doc: jsPDF,
  currentUser: any,
  kepalaName: string,
  kepalaNIP: string,
  startY: number
) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Pastikan TTD tidak terlalu ke bawah
  const signatureY = Math.min(startY + 20, pageHeight - 60)

  // Garis pemisah
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.5)
  doc.line(10, signatureY - 5, pageWidth - 10, signatureY - 5)

  // Data user
  const userName = currentUser?.name || "________________"
  const userNip = (currentUser as any)?.nip || "________________"

  // TTD kiri (Petugas TD)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("Petugas TD", 30, signatureY + 10)
  doc.text(`Nama: ${userName}`, 30, signatureY + 20)
  doc.text(`NIP: ${userNip}`, 30, signatureY + 30)
  doc.text("Tanda Tangan: ________________", 30, signatureY + 45)

  // TTD kanan (Ketua)
  const rightX = pageWidth - 80
  doc.text("Mengetahui,", rightX, signatureY + 10)
  doc.text("Ketua", rightX, signatureY + 20)
  doc.text(`Nama: ${kepalaName}`, rightX, signatureY + 30)
  doc.text(`NIP: ${kepalaNIP}`, rightX, signatureY + 40)
  doc.text("Tanda Tangan: ________________", rightX, signatureY + 55)
}

// Utility function untuk mendapatkan data kepala
export function getKepalaData() {
  return {
    name: process.env.NEXT_PUBLIC_KEPALA_NAME || "Dr. John Doe, M.Si.",
    nip: process.env.NEXT_PUBLIC_KEPALA_NIP || "19651231 199203 1 001"
  }
}