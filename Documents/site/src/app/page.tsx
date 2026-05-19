"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { categories } from "@/lib/products"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Settings, User, LogOut } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { storage, initializeStorage } from "@/lib/storage"
import { Product } from "@/lib/products"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [products, setProducts] = useState<Product[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const { addToCart, getCartCount } = useCart()
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    initializeStorage()
    const savedProducts = storage.get('products')
    if (savedProducts) {
      setProducts(savedProducts)
    } else {
      // Load default products if none exist
      const { products: defaultProducts } = require('@/lib/products')
      setProducts(defaultProducts)
      storage.set('products', defaultProducts)
    }

    const savedAnnouncements = storage.get('announcements')
    if (savedAnnouncements) {
      setAnnouncements(savedAnnouncements)
    }
  }, [])

  const filteredProducts = selectedCategory === "Tous" 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  const cartCount = getCartCount()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">BotShop</h1>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Déconnexion">
                  <LogOut className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="relative" onClick={() => router.push("/cart")}>
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => router.push("/auth/login")}>
                  <User className="mr-2 h-4 w-4" />
                  Connexion
                </Button>
                <Button variant="outline" size="icon" className="relative" onClick={() => router.push("/cart")}>
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => router.push("/admin/login")}>
                  <Settings className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-12 text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Bienvenue sur BotShop
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
          Découvrez notre sélection de bots, outils et services pour automatiser vos projets
        </p>
        
        {/* Discord Announcement */}
        <div className="max-w-md mx-auto">
          {(() => {
            const activeAnnouncement = announcements.find((a: any) => a.active && a.discordLink)
            if (activeAnnouncement) {
              return (
                <a
                  href={activeAnnouncement.discordLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Rejoindre le Discord
                </a>
              )
            }
            return null
          })()}
        </div>
      </section>

      {/* Category Filter */}
      <section className="container px-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="container px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.category}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {product.isSubscription && (
                      <Badge className="bg-purple-600">
                        {product.subscriptionDuration === 'monthly' && 'Mensuel'}
                        {product.subscriptionDuration === 'yearly' && 'Annuel'}
                        {product.subscriptionDuration === 'lifetime' && 'À vie'}
                      </Badge>
                    )}
                    <Badge>{product.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{product.price.toFixed(2)}€</span>
                  <span className="text-sm text-muted-foreground">
                    {product.stock} en stock
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => addToCart(product.id)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Ajouter au panier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
