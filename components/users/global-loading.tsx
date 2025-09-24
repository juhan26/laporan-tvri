// components/global-loading.tsx
"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => setIsLoading(false)

    // Listen to route changes
    window.addEventListener('beforeunload', handleStart)
    window.addEventListener('load', handleComplete)

    return () => {
      window.removeEventListener('beforeunload', handleStart)
      window.removeEventListener('load', handleComplete)
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="text-gray-700">Loading...</span>
      </div>
    </div>
  )
}