"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const handleSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      console.log("Auth callback session:", data, error)
      // ✅ setelah dapat session, redirect ke dashboard
      router.replace("/dashboard")
    }

    handleSession()
  }, [router, supabase])

  return <p>Processing login...</p>
}
