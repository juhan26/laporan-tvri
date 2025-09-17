"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import { ReportsTable } from "@/components/reports/reports-table"
import type { BroadcastReport } from "@/lib/types"

export default function ReportsPage() {
  const [reports, setReports] = useState<BroadcastReport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchReports = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("broadcast_reports")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setReports(data || [])
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        <div className="container mx-auto p-6">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />

      <div className="container mx-auto p-6">
        <ReportsTable reports={reports} onReportsChange={fetchReports} />
      </div>
    </div>
  )
}
