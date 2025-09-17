"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      console.log("[v0] Attempting login with email:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      console.log("[v0] Login response:", { data, error })

      if (error) {
        console.log("[v0] Login error details:", error)
        throw error
      }

      console.log("[v0] Login successful, redirecting to dashboard")
      router.push("/dashboard")
    } catch (error: any) {
      console.log("[v0] Caught error:", error)
      setError(error.message || "Email atau password salah")
    } finally {
      setIsLoading(false)
    }
  }

  const testConnection = async () => {
    try {
      const supabase = createClient()
      console.log("[v0] Testing database connection...")

      const { data, error } = await supabase.from("users").select("username, name").limit(1)
      console.log("[v0] Database test result:", { data, error })

      if (error) {
        setError(`Database connection error: ${error.message}`)
      } else {
        setError(`Database connected! Found ${data?.length || 0} users`)
      }
    } catch (error: any) {
      console.log("[v0] Database test error:", error)
      setError(`Connection test failed: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-blue-800 text-white p-4 rounded-lg mb-4 mx-auto w-fit">
            <h1 className="text-2xl font-bold">TVRI</h1>
            <p className="text-sm">Sistem Laporan Siaran</p>
          </div>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Masuk ke sistem laporan siaran TVRI</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-900" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
            <Button type="button" variant="outline" className="w-full bg-transparent" onClick={testConnection}>
              Test Database Connection
            </Button>
          </form>
          <div className="mt-6 text-xs text-muted-foreground">
            <p className="font-semibold mb-2">Demo accounts:</p>
            <div className="space-y-1">
              <p>• Admin: bagus@tvri.com / password123</p>
              <p>• Operator: alan@tvri.com / password123</p>
              <p>• Operator: hafiz@tvri.com / password123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
