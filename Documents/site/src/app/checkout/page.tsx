"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from '@stripe/stripe-js'
import { products } from "@/lib/products"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/CartContext"
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { validators } from "@/lib/validation"
import { storage } from "@/lib/storage"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [error, setError] = useState("")
  const [stripeEnabled, setStripeEnabled] = useState(false)
  const [stripeKey, setStripeKey] = useState("")

  useEffect(() => {
    const siteSettings = storage.get('siteSettings')
    if (siteSettings) {
      setStripeEnabled(siteSettings.stripeEnabled || false)
      setStripeKey(siteSettings.stripePublishableKey || "")
    }
  }, [])

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    discordUsername: ""
  })

  const cartItems = cart.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)
  })).filter(item => item.product !== undefined)

  const total = cartItems.reduce((sum, item) => sum + (item.product!.price * item.quantity), 0)

  if (cartItems.length === 0 && !orderComplete) {
    router.push("/")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate Discord username
    const discordValidation = validators.discordUsername(formData.discordUsername)
    if (!discordValidation.valid) {
      setError(discordValidation.error || "Pseudo Discord invalide")
      return
    }

    setIsProcessing(true)

    if (stripeEnabled && stripeKey) {
      // Stripe Checkout integration
      try {
        const stripe = await loadStripe(stripeKey)
        if (!stripe) {
          setError("Erreur de chargement de Stripe")
          setIsProcessing(false)
          return
        }

        // In a real application, you would create a checkout session on your backend
        // For now, we'll show a message explaining the limitation
        setError("Pour utiliser Stripe, vous devez configurer un backend pour créer les sessions de paiement. Contactez le développeur.")
        setIsProcessing(false)
      } catch (err) {
        setError("Erreur lors de l'initialisation de Stripe")
        setIsProcessing(false)
      }
    } else {
      // Simulate payment processing (demo mode)
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsProcessing(false)
      setOrderComplete(true)
      clearCart()
    }
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Commande confirmée !</h2>
            <p className="text-muted-foreground mb-6">
              Merci pour votre achat. Vous recevrez un email de confirmation avec les détails de votre commande.
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              Retourner à la boutique
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/cart")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Commander</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="container px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations de livraison</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Prénom</label>
                      <Input
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Jean"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom</label>
                      <Input
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Dupont"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jean.dupont@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pseudo Discord <span className="text-red-500">*</span></label>
                    <Input
                      required
                      value={formData.discordUsername}
                      onChange={(e) => setFormData({ ...formData, discordUsername: e.target.value })}
                      placeholder="username#0000"
                    />
                    <p className="text-xs text-muted-foreground">
                      Requis pour la livraison. Vous devez être membre du serveur Discord.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Adresse</label>
                    <Input
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Rue de la Paix"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ville</label>
                      <Input
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Paris"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Code postal</label>
                      <Input
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        placeholder="75001"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pays</label>
                    <Input
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing ? "Traitement en cours..." : `Payer ${total.toFixed(2)}€`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product!.name} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {(item.product!.price * item.quantity).toFixed(2)}€
                    </span>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-medium">{total.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="font-medium">Gratuite</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{total.toFixed(2)}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
