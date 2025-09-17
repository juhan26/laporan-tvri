import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import { ReportForm } from "@/components/reports/report-form"
import type { BroadcastReport } from "@/lib/types"

interface EditReportPageProps {
  params: Promise<{ id: string }>
}

export default async function EditReportPage({ params }: EditReportPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin (only admins can edit reports)
  const { data: userProfile } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (userProfile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch the report to edit
  const { data: report, error } = await supabase.from("broadcast_reports").select("*").eq("id", id).single()

  if (error || !report) {
    redirect("/reports")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />

      <div className="container mx-auto p-6">
        <ReportForm initialData={report as BroadcastReport} isEditing={true} />
      </div>
    </div>
  )
}
