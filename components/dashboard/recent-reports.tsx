"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BroadcastReport } from "@/lib/types"

interface RecentReportsProps {
  reports: BroadcastReport[]
}

export function RecentReports({ reports }: RecentReportsProps) {
  const recentReports = reports.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-blue-800">Laporan Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="p-3 text-left text-blue-800">Tanggal</th>
                <th className="p-3 text-left text-blue-800">Program</th>
                <th className="p-3 text-left text-blue-800">Kualitas</th>
                <th className="p-3 text-left text-blue-800">Kendala</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{new Date(report.tanggal).toLocaleDateString("id-ID")}</td>
                  <td className="p-3">{report.program}</td>
                  <td className="p-3">
                    <Badge variant={report.kualitas_siaran === "Baik" ? "default" : "destructive"}>
                      {report.kualitas_siaran}
                    </Badge>
                  </td>
                  <td className="p-3">{report.kendala || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentReports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">Belum ada laporan</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
