// hooks/use-loading.ts
"use client"

import { useState, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function useLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 500) // Simulate loading

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return isLoading
}