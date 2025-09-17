"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BroadcastReport } from "@/lib/types"

interface StatsCardsProps {
  reports: BroadcastReport[]
}

export function StatsCards({ reports }: StatsCardsProps) {
  const totalReports = reports.length
  const goodQualityReports = reports.filter((r) => r.kualitas_siaran === "Baik").length
  const badQualityReports = reports.filter((r) => r.kualitas_siaran === "Tidak Baik").length

  const stats = [
    {
      title: "Total Laporan",
      value: totalReports,
      borderColor: "border-blue-800",
    },
    {
      title: "Siaran Baik",
      value: goodQualityReports,
      borderColor: "border-green-500",
    },
    {
      title: "Siaran Bermasalah",
      value: badQualityReports,
      borderColor: "border-red-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`border-l-4 ${stat.borderColor}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-blue-800">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
