"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/contexts/AdminContext"
import { useCart } from "@/contexts/CartContext"
import { LayoutDashboard, Package, Megaphone, LogOut, ShoppingBag, Users, Settings } from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { logout } = useAdmin()
  const { getCartCount } = useCart()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const stats = [
    {
      title: "Produits",
      value: "8",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Commandes",
      value: "0",
      icon: ShoppingBag,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Annonces",
      value: "0",
      icon: Megaphone,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Panier actif",
      value: getCartCount().toString(),
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const quickActions = [
    {
      title: "Gérer les produits",
      description: "Ajouter, modifier ou supprimer des produits",
      icon: Package,
      onClick: () => router.push("/admin/products"),
    },
    {
      title: "Gérer les annonces",
      description: "Créer et gérer les annonces",
      icon: Megaphone,
      onClick: () => router.push("/admin/announcements"),
    },
    {
      title: "Paramètres du site",
      description: "Configurer l'apparence et les fonctionnalités",
      icon: Settings,
      onClick: () => router.push("/admin/settings"),
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Administration</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </header>

      <div className="container px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Tableau de bord</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <h3 className="text-xl font-semibold mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Card key={action.title} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={action.onClick}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <action.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{action.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Back to shop */}
        <div className="mt-8">
          <Button variant="outline" onClick={() => router.push("/")}>
            Retourner à la boutique
          </Button>
        </div>
      </div>
    </div>
  )
}
