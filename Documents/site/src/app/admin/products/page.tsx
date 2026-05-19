"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Product } from "@/lib/products"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from "lucide-react"
import { storage, initializeStorage } from "@/lib/storage"
import { sanitize } from "@/lib/validation"

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])

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
  }, [])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "Bots",
    image: "",
    stock: 10,
    isSubscription: false,
    subscriptionDuration: "monthly"
  })

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
  }

  const handleSave = (id: string) => {
    setEditingId(null)
    storage.set('products', products)
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      const updatedProducts = products.filter(p => p.id !== id)
      setProducts(updatedProducts)
      storage.set('products', updatedProducts)
    }
  }

  const handleAdd = () => {
    if (newProduct.name && newProduct.description && newProduct.price) {
      const product: Product = {
        id: Date.now().toString(),
        name: sanitize.text(newProduct.name),
        description: sanitize.text(newProduct.description),
        price: newProduct.price || 0,
        category: sanitize.text(newProduct.category || "Bots"),
        image: newProduct.image || "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=300&fit=crop",
        stock: newProduct.stock || 10,
        isSubscription: newProduct.isSubscription || false,
        subscriptionDuration: newProduct.subscriptionDuration || "monthly"
      }
      const updatedProducts = [...products, product]
      setProducts(updatedProducts)
      storage.set('products', updatedProducts)
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        category: "Bots",
        image: "",
        stock: 10,
        isSubscription: false,
        subscriptionDuration: "monthly"
      })
      setIsAdding(false)
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      category: "Bots",
      image: "",
      stock: 10,
      isSubscription: false,
      subscriptionDuration: "monthly"
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const updateProduct = (id: string, field: keyof Product, value: string | number | boolean) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, [field]: typeof value === 'string' ? sanitize.text(value) : value } : p
    )
    setProducts(updatedProducts)
    storage.set('products', updatedProducts)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Button variant="ghost" onClick={() => router.push("/admin/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Gestion des produits</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="container px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Produits ({products.length})</h2>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>

        {/* Add Product Form */}
        {isAdding && (
          <Card className="mb-6 border-2 border-primary">
            <CardHeader>
              <CardTitle>Nouveau produit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom</label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Nom du produit"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Catégorie</label>
                  <Input
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    placeholder="Bots, Outils, Templates, Services"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Description du produit"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prix (€)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    placeholder="29.99"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock</label>
                  <Input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image</label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="flex-1"
                    />
                  </div>
                  {newProduct.image && (
                    <img src={newProduct.image} alt="Preview" className="w-20 h-20 object-cover rounded mt-2" />
                  )}
                </div>
              </div>

              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isSubscription"
                    checked={newProduct.isSubscription}
                    onChange={(e) => setNewProduct({ ...newProduct, isSubscription: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <label htmlFor="isSubscription" className="text-sm font-medium">Produit d'abonnement</label>
                </div>
                
                {newProduct.isSubscription && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Durée de l'abonnement</label>
                    <select
                      value={newProduct.subscriptionDuration}
                      onChange={(e) => setNewProduct({ ...newProduct, subscriptionDuration: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="monthly">Mensuel</option>
                      <option value="yearly">Annuel</option>
                      <option value="lifetime">À vie</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd}>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    {editingId === product.id ? (
                      <div className="space-y-3">
                        <Input
                          value={product.name}
                          onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                          placeholder="Nom"
                        />
                        <Input
                          value={product.description}
                          onChange={(e) => updateProduct(product.id, "description", e.target.value)}
                          placeholder="Description"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={product.price}
                            onChange={(e) => updateProduct(product.id, "price", parseFloat(e.target.value))}
                            placeholder="Prix"
                          />
                          <Input
                            type="number"
                            value={product.stock}
                            onChange={(e) => updateProduct(product.id, "stock", parseInt(e.target.value))}
                            placeholder="Stock"
                          />
                          <Input
                            value={product.category}
                            onChange={(e) => updateProduct(product.id, "category", e.target.value)}
                            placeholder="Catégorie"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={product.isSubscription}
                            onChange={(e) => updateProduct(product.id, "isSubscription", e.target.checked)}
                            className="h-4 w-4"
                          />
                          <label className="text-sm font-medium">Abonnement</label>
                        </div>
                        {product.isSubscription && (
                          <select
                            value={product.subscriptionDuration}
                            onChange={(e) => updateProduct(product.id, "subscriptionDuration", e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="monthly">Mensuel</option>
                            <option value="yearly">Annuel</option>
                            <option value="lifetime">À vie</option>
                          </select>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSave(product.id)}>
                            <Save className="mr-2 h-4 w-4" />
                            Enregistrer
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                          <div className="flex gap-4 text-sm">
                            <span className="font-medium">{product.price.toFixed(2)}€</span>
                            <span className="text-muted-foreground">Stock: {product.stock}</span>
                            <span className="text-muted-foreground">{product.category}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="outline" onClick={() => handleEdit(product)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" onClick={() => handleDelete(product.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
