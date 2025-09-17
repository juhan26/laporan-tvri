import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import { ReportForm } from "@/components/reports/report-form"

export default async function NewReportPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: userProfile } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (userProfile?.role !== "admin" && userProfile?.role !== "operator") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />

      <div className="container mx-auto p-6">
        <ReportForm />
      </div>
    </div>
  )
}
