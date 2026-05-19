"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Globe, Palette, CreditCard, Save, Settings } from "lucide-react"
import { storage, initializeStorage } from "@/lib/storage"

interface SiteSettings {
  siteName: string
  siteDescription: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  currency: string
  currencySymbol: string
  maintenanceMode: boolean
  stripePublishableKey: string
  stripeEnabled: boolean
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'BotShop',
    siteDescription: 'Découvrez notre sélection de bots, outils et services pour automatiser vos projets',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    accentColor: '#ec4899',
    currency: 'EUR',
    currencySymbol: '€',
    maintenanceMode: false,
    stripePublishableKey: "",
    stripeEnabled: false
  })
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    initializeStorage()
    const savedSettings = storage.get('siteSettings')
    if (savedSettings) {
      setSettings(savedSettings)
    }
  }, [])

  const handleChange = (field: keyof SiteSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    const updatedSettings: SiteSettings = {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      accentColor: settings.accentColor,
      currency: settings.currency,
      currencySymbol: settings.currencySymbol,
      maintenanceMode: settings.maintenanceMode,
      stripePublishableKey: settings.stripePublishableKey,
      stripeEnabled: settings.stripeEnabled
    }
    storage.set('siteSettings', updatedSettings)
    setHasChanges(false)
  }

  const handleReset = () => {
    const defaultSettings: SiteSettings = {
      siteName: 'BotShop',
      siteDescription: 'Découvrez notre sélection de bots, outils et services pour automatiser vos projets',
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      accentColor: '#3b82f6',
      currency: 'EUR',
      currencySymbol: '€',
      maintenanceMode: false,
      stripePublishableKey: "",
      stripeEnabled: false
    }
    setSettings(defaultSettings)
    setHasChanges(true)
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
          <h1 className="text-2xl font-bold">Paramètres du site</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="container px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Configuration générale</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              Réinitialiser
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom du site</label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  placeholder="BotShop"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description du site</label>
                <Input
                  value={settings.siteDescription}
                  onChange={(e) => handleChange('siteDescription', e.target.value)}
                  placeholder="Découvrez notre sélection de bots, outils et services"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Devise</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="maintenanceMode" className="text-sm font-medium">Mode maintenance</label>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apparence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Couleur principale</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Couleur secondaire</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    value={settings.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Couleur d'accent</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    value={settings.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stripe Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Paiement Stripe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stripeEnabled"
                  checked={settings.stripeEnabled}
                  onChange={(e) => handleChange('stripeEnabled', e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="stripeEnabled" className="text-sm font-medium">Activer Stripe</label>
              </div>

              {settings.stripeEnabled && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Clé publique Stripe (Publishable Key)</label>
                  <Input
                    type="password"
                    value={settings.stripePublishableKey}
                    onChange={(e) => handleChange('stripePublishableKey', e.target.value)}
                    placeholder="pk_test_..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Obtenez votre clé depuis le tableau de bord Stripe
                  </p>
                </div>
              )}

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Pour utiliser Stripe, vous devez avoir un compte Stripe actif. 
                  Créez un compte sur <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="underline">stripe.com</a> 
                  et obtenez votre clé publique depuis le tableau de bord.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Mode maintenance</h3>
                  <p className="text-sm text-muted-foreground">
                    Désactive le site pour les utilisateurs non-admin
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
