"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAdmin } from "@/contexts/AdminContext"
import { Lock, ArrowLeft, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, remainingAttempts, lockoutTime } = useAdmin()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = login(password)
    
    if (result.success) {
      router.push("/admin/dashboard")
    } else {
      setError(result.error || "Mot de passe incorrect")
    }
    
    setIsLoading(false)
  }

  const formatLockoutTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Lock className="h-6 w-6" />
              Administration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Mot de passe admin</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe"
                  required
                  disabled={lockoutTime > 0 || isLoading}
                />
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
              
              {lockoutTime > 0 && (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span>Verrouillé. Réessayez dans {formatLockoutTime(lockoutTime)}</span>
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={lockoutTime > 0 || isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
            
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground text-center">
                Mot de passe par défaut: admin123
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Tentatives restantes: {remainingAttempts}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
