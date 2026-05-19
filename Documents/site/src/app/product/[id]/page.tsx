"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowLeft, Package, Check } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { storage } from "@/lib/storage"
import { Product } from "@/lib/products"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { addToCart, getCartCount } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedProducts = storage.get('products')
    let allProducts = savedProducts
    
    if (!allProducts) {
      const { products: defaultProducts } = require('@/lib/products')
      allProducts = defaultProducts
    }

    const foundProduct = allProducts.find((p: Product) => p.id === params.id)
    setProduct(foundProduct || null)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Produit</h1>
            <div className="w-10" />
          </div>
        </header>

        <div className="container px-4 py-16 flex flex-col items-center justify-center text-center">
          <Package className="h-24 w-24 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Produit non trouvé</h2>
          <p className="text-muted-foreground mb-6">Ce produit n'existe pas ou a été supprimé</p>
          <Button onClick={() => router.push("/")}>
            Retourner à la boutique
          </Button>
        </div>
      </div>
    )
  }

  const features = [
    "Configuration personnalisable",
    "Support technique 24/7",
    "Mises à jour gratuites",
    "Documentation complète",
    "Installation assistée"
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Détail du produit</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="container px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video w-full overflow-hidden bg-muted rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex gap-2 mb-2">
                <Badge>{product.category}</Badge>
                {product.isSubscription && (
                  <Badge className="bg-purple-600">
                    {product.subscriptionDuration === 'monthly' && 'Mensuel'}
                    {product.subscriptionDuration === 'yearly' && 'Annuel'}
                    {product.subscriptionDuration === 'lifetime' && 'À vie'}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground text-lg">{product.description}</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Prix et disponibilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{product.price.toFixed(2)}€</span>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {product.stock} en stock
                    </span>
                  </div>
                </div>
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-5 w-5" />
                    <span>Disponible immédiatement</span>
                  </div>
                ) : (
                  <div className="text-red-600">
                    Rupture de stock
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Caractéristiques</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Button
              className="w-full"
              size="lg"
              onClick={() => addToCart(product.id)}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => router.push("/")}
            >
              Continuer mes achats
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
