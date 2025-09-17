"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Plus, Settings } from "lucide-react"
import Link from "next/link"

export function AdminQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Aksi Cepat Admin
        </CardTitle>
        <CardDescription>Kelola sistem dan user dengan mudah</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
            <Link href="/users">
              <Users className="h-6 w-6 text-blue-600" />
              <div className="text-center">
                <div className="font-medium">Kelola User</div>
                <div className="text-xs text-gray-500">Tambah & hapus user</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
            <Link href="/reports/new">
              <Plus className="h-6 w-6 text-green-600" />
              <div className="text-center">
                <div className="font-medium">Buat Laporan</div>
                <div className="text-xs text-gray-500">Tambah laporan baru</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
            <Link href="/reports">
              <FileText className="h-6 w-6 text-purple-600" />
              <div className="text-center">
                <div className="font-medium">Lihat Semua</div>
                <div className="text-xs text-gray-500">Data laporan lengkap</div>
              </div>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
