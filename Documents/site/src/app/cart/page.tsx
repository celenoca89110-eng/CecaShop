"use client"

import { useRouter } from "next/navigation"
import { products } from "@/lib/products"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()

  const cartItems = cart.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)
  })).filter(item => item.product !== undefined)

  const total = cartItems.reduce((sum, item) => sum + (item.product!.price * item.quantity), 0)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Panier</h1>
            <div className="w-10" />
          </div>
        </header>

        <div className="container px-4 py-16 flex flex-col items-center justify-center text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Votre panier est vide</h2>
          <p className="text-muted-foreground mb-6">Ajoutez des produits pour commencer vos achats</p>
          <Button onClick={() => router.push("/")}>
            Retourner à la boutique
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Panier</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="container px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.productId}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.product!.image}
                        alt={item.product!.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.product!.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.product!.category}</p>
                      <p className="text-xl font-bold">{item.product!.price.toFixed(2)}€</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="font-medium">{total.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="font-medium">Gratuite</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{total.toFixed(2)}€</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" size="lg" onClick={() => router.push("/checkout")}>
                  Passer la commande
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => clearCart()}
                >
                  Vider le panier
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
