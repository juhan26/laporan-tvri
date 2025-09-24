"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { User as AppUser } from "@/lib/types"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  userProfile: AppUser | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        setUser(session?.user ?? null)

        if (session?.user) {
          // Fetch user profile
          const { data: profile, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle()


          if (error) {
            console.error("Error fetching user profile:", error)
          }

          if (!profile) {
            console.warn("⚠️ User not found in users table")
            await supabase.auth.signOut()
            router.push("/auth/login")
            return
          }

          if (!profile || (profile.role !== "admin" && profile.role !== "operator")) {
            console.error("User does not have valid role:", profile?.role)
            await supabase.auth.signOut()
            router.push("/auth/login")
            return
          }

          setUserProfile(profile)
        }
      } catch (error) {
        console.error("Session error:", error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)

      if (event === "SIGNED_OUT" || (event === "TOKEN_REFRESHED" && !session)) {
        setUser(null)
        setUserProfile(null)
        router.push("/auth/login")
        return
      }

      setUser(session?.user ?? null)

      if (session?.user) {
        try {
          // Fetch user profile
          const { data: profile, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle()


          if (error) {
            console.error("Error fetching user profile:", error)
            await supabase.auth.signOut()
            return
          }

          if (!profile || (profile.role !== "admin" && profile.role !== "operator")) {
            console.error("Invalid user role:", profile?.role)
            // await supabase.auth.signOut()
            return
          }

          setUserProfile(profile)
        } catch (error) {
          console.error("Profile fetch error:", error)
          await supabase.auth.signOut()
        }
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  // auth-provider.tsx (additional function)
  const ensureUserProfile = async (user: any) => {
    if (!user) return null;

    // Cek apakah user sudah ada di tabel users
    const { data: existingProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !existingProfile) {
      // Jika belum ada, buat profile baru
      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          name: user.user_metadata?.name || user.email,
          username: user.user_metadata?.username || user.email,
          email: user.email,
          role: user.user_metadata?.role || 'operator',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user profile:', createError);
        return null;
      }

      return newProfile;
    }

    return existingProfile;
  };

  const signOut = async () => {
    try {
      setUser(null)
      setUserProfile(null)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Sign out error:", error)
      }
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, userProfile, loading, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
