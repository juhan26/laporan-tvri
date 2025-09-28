"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BroadcastReport } from "@/lib/types"

interface StatsCardsProps {
  reports: BroadcastReport[]
}

export function StatsCards({ reports }: StatsCardsProps) {
  const totalReports = reports.length


  // tanggal terbaru laporan
  const latestReport = reports[0]?.created_at
    ? new Date(reports[0].created_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-"

  // jumlah hari unik
  const uniqueDays = new Set(
    reports.map((r) => new Date(r.created_at).toDateString())
  ).size

  const stats = [
    {
      title: "Total Laporan",
      value: totalReports,
      borderColor: "border-blue-800",
      textColor: "text-blue-800",
    },
    {
      title: "Hari Terlapor",
      value: uniqueDays,
      borderColor: "border-purple-500",
      textColor: "text-purple-600",
    },
    {
      title: "Laporan Terakhir",
      value: latestReport,
      borderColor: "border-orange-500",
      textColor: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`border-l-4 ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow`}
        >
          <CardHeader className="pb-2">
            <CardTitle className={`text-lg font-semibold ${stat.textColor}`}>
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
