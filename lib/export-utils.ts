import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"
import type { BroadcastReport } from "./types"

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export function exportToExcel(reports: BroadcastReport[], filename = "laporan-td-penyiaran") {
  const excelData = reports.map((report, index) => ({
    No: index + 1,
    "Tanggal/Hari": new Date(report.tanggal).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    "Petugas TD": report.petugas.join("/"),
    Video: report.kualitas_video || report.kualitas_siaran,
    Audio: report.kualitas_audio || report.kualitas_siaran,
    Jam: `${report.jam_mulai}-${report.jam_selesai}`,
    Masalah: report.kendala || "Siaran lancar",
    Penanganan: report.penanganan || "-",
    Keterangan: report.keterangan || "",
  }))

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(excelData)

  const colWidths = [
    { wch: 5 }, // No
    { wch: 20 }, // Tanggal/Hari
    { wch: 15 }, // Petugas TD
    { wch: 10 }, // Video
    { wch: 10 }, // Audio
    { wch: 15 }, // Jam
    { wch: 40 }, // Masalah
    { wch: 30 }, // Penanganan
    { wch: 30 }, // Keterangan
  ]
  ws["!cols"] = colWidths

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Laporan TD Penyiaran")

  // Generate filename with current date
  const currentDate = new Date().toISOString().split("T")[0]
  const finalFilename = `${filename}-${currentDate}.xlsx`

  // Save file
  XLSX.writeFile(wb, finalFilename)
}

export function exportToPDF(reports: BroadcastReport[], filename = "laporan-td-penyiaran") {
  const doc = new jsPDF("landscape", "mm", "a4")

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("LAPORAN TD PENYIARAN", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" })

  // Add generation date
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const currentDate = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  doc.text(`Dicetak pada: ${currentDate}`, doc.internal.pageSize.getWidth() / 2, 30, { align: "center" })

  const tableData = reports.map((report, index) => [
    index + 1,
    new Date(report.tanggal).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    report.petugas.join("/"),
    report.kualitas_video || report.kualitas_siaran,
    report.kualitas_audio || report.kualitas_siaran,
    `${report.jam_mulai}-${report.jam_selesai}`,
    report.kendala || "Siaran lancar",
    report.penanganan || "-",
    report.keterangan || "",
  ])

  doc.autoTable({
    head: [["NO", "Tanggal/Hari", "Petugas TD", "Video", "Audio", "Jam", "Masalah", "Penanganan", "Keterangan"]],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 7,
      cellPadding: 1.5,
    },
    headStyles: {
      fillColor: [30, 58, 138], // Blue-800
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Gray-50
    },
    columnStyles: {
      0: { cellWidth: 8 }, // NO
      1: { cellWidth: 30 }, // Tanggal/Hari
      2: { cellWidth: 20 }, // Petugas TD
      3: { cellWidth: 12 }, // Video
      4: { cellWidth: 12 }, // Audio
      5: { cellWidth: 20 }, // Jam
      6: { cellWidth: 35 }, // Masalah
      7: { cellWidth: 30 }, // Penanganan
      8: { cellWidth: 30 }, // Keterangan
    },
    margin: { top: 40, right: 10, bottom: 20, left: 10 },
  })

  // Add footer
  const pageCount = doc.internal.pages.length - 1
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      doc.internal.pageSize.getWidth() - 20,
      doc.internal.pageSize.getHeight() - 10,
      { align: "right" },
    )
  }

  // Generate filename with current date
  const currentDateString = new Date().toISOString().split("T")[0]
  const finalFilename = `${filename}-${currentDateString}.pdf`

  // Save file
  doc.save(finalFilename)
}
