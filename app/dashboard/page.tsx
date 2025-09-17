import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentReports } from "@/components/dashboard/recent-reports"
import { AdminQuickActions } from "@/components/dashboard/admin-quick-actions"
import type { BroadcastReport } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: userProfile } = await supabase.from("users").select("role").eq("id", user.id).single()

  // Fetch reports
  const { data: reports = [] } = await supabase
    .from("broadcast_reports")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />

      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blue-800">Dashboard Laporan Siaran</h2>
            <div className="text-sm text-gray-600">
              Selamat datang, {userProfile?.role === "admin" ? "Admin" : "Operator"}
            </div>
          </div>

          <StatsCards reports={reports as BroadcastReport[]} />

          {userProfile?.role === "admin" && <AdminQuickActions />}

          <RecentReports reports={reports as BroadcastReport[]} />
        </div>
      </div>
    </div>
  )
}
