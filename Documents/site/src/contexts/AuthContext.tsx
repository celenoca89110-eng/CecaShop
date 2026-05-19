"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { storage } from "@/lib/storage"
import { validators, sanitize } from "@/lib/validation"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'user' | 'admin'
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => { success: boolean; error?: string }
  register: (email: string, password: string, firstName: string, lastName: string) => { success: boolean; error?: string }
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const userSession = storage.get('userSession')
    if (userSession && userSession.expiresAt > Date.now()) {
      setUser(userSession.user)
    } else {
      storage.remove('userSession')
    }
  }, [])

  const register = (email: string, password: string, firstName: string, lastName: string): { success: boolean; error?: string } => {
    // Validate inputs
    if (!validators.email(email)) {
      return { success: false, error: "Email invalide" }
    }

    const passwordValidation = validators.password(password)
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.errors[0] }
    }

    if (!validators.text(firstName, 1, 50)) {
      return { success: false, error: "Le prénom doit contenir entre 1 et 50 caractères" }
    }

    if (!validators.text(lastName, 1, 50)) {
      return { success: false, error: "Le nom doit contenir entre 1 et 50 caractères" }
    }

    // Sanitize inputs
    const sanitizedEmail = sanitize.text(email.toLowerCase())
    const sanitizedFirstName = sanitize.text(firstName)
    const sanitizedLastName = sanitize.text(lastName)

    // Check if user already exists
    const users = storage.get('users') || []
    if (users.some((u: User) => u.email === sanitizedEmail)) {
      return { success: false, error: "Cet email est déjà utilisé" }
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: sanitizedEmail,
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      role: 'user',
      createdAt: new Date().toISOString()
    }

    // Store user (in production, password should be hashed with bcrypt on backend)
    users.push({ ...newUser, passwordHash: btoa(password) })
    storage.set('users', users)

    return { success: true }
  }

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    // Validate email
    if (!validators.email(email)) {
      return { success: false, error: "Email invalide" }
    }

    const sanitizedEmail = sanitize.text(email.toLowerCase())
    const users = storage.get('users') || []
    
    const user = users.find((u: any) => u.email === sanitizedEmail)
    
    if (!user) {
      return { success: false, error: "Email ou mot de passe incorrect" }
    }

    // In production, use bcrypt.compare on backend
    if (user.passwordHash !== btoa(password)) {
      return { success: false, error: "Email ou mot de passe incorrect" }
    }

    // Create session
    const sessionUser: User = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt
    }

    storage.set('userSession', {
      user: sessionUser,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })

    setUser(sessionUser)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    storage.remove('userSession')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
