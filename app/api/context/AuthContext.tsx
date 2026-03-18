"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/MorphTest-main/app/lib/supabaseClient"
import { User } from "@supabase/supabase-js"

// Definoni tipin e context-it
interface AuthContextType {
  user: User | null
}

// Krijo context me tipin e duhur
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Definoni tipin për props
interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Merr session kur refresh
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}