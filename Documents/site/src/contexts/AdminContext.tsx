"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { storage } from "@/lib/storage"
import { loginRateLimiter } from "@/lib/validation"

interface AdminContextType {
  isAdmin: boolean
  login: (password: string) => { success: boolean; error?: string }
  logout: () => void
  remainingAttempts: number
  lockoutTime: number
}

const ADMIN_PASSWORD = "admin123" // En production, utiliser un système d'authentification sécurisé avec bcrypt

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [remainingAttempts, setRemainingAttempts] = useState(5)
  const [lockoutTime, setLockoutTime] = useState(0)

  useEffect(() => {
    // Check if admin is already logged in from localStorage
    const adminSession = storage.get('adminSession')
    if (adminSession && adminSession.expiresAt > Date.now()) {
      setIsAdmin(true)
    } else {
      storage.remove('adminSession')
    }
  }, [])

  const login = (password: string): { success: boolean; error?: string } => {
    const identifier = 'admin_login'
    
    // Check rate limiting
    if (!loginRateLimiter.canAttempt(identifier)) {
      const lockout = loginRateLimiter.getLockoutTime(identifier)
      const minutes = Math.ceil(lockout / 60000)
      return { 
        success: false, 
        error: `Trop de tentatives. Réessayez dans ${minutes} minute(s).` 
      }
    }

    loginRateLimiter.recordAttempt(identifier)
    setRemainingAttempts(loginRateLimiter.getRemainingAttempts(identifier))

    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      loginRateLimiter.reset(identifier)
      setRemainingAttempts(5)
      
      // Store session in localStorage (expires in 1 hour)
      storage.set('adminSession', {
        expiresAt: Date.now() + 60 * 60 * 1000
      })
      
      return { success: true }
    }

    const remaining = loginRateLimiter.getRemainingAttempts(identifier)
    setRemainingAttempts(remaining)
    
    if (remaining === 0) {
      const lockout = loginRateLimiter.getLockoutTime(identifier)
      setLockoutTime(lockout)
    }

    return { 
      success: false, 
      error: `Mot de passe incorrect. ${remaining} tentative(s) restante(s).` 
    }
  }

  const logout = () => {
    setIsAdmin(false)
    storage.remove('adminSession')
    loginRateLimiter.reset('admin_login')
    setRemainingAttempts(5)
    setLockoutTime(0)
  }

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, remainingAttempts, lockoutTime }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
