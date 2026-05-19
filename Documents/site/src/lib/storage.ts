// LocalStorage wrapper for data persistence
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  },
  
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },
  
  remove: (key: string) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },
  
  clear: () => {
    if (typeof window === 'undefined') return
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}

// Initialize default data
export const initializeStorage = () => {
  // Initialize default products if not exists
  if (!storage.get('products')) {
    const { products } = require('@/lib/products')
    storage.set('products', products)
  }

  // Initialize default announcements if not exists
  if (!storage.get('announcements')) {
    storage.set('announcements', [])
  }

  // Initialize default users if not exists
  if (!storage.get('users')) {
    storage.set('users', [])
  }

  // Initialize default site settings if not exists
  if (!storage.get('siteSettings')) {
    storage.set('siteSettings', {
      siteName: "BotShop",
      siteDescription: "Découvrez notre sélection de bots, outils et services pour automatiser vos projets",
      primaryColor: "#6366f1",
      secondaryColor: "#8b5cf6",
      accentColor: "#ec4899",
      currency: "EUR",
      maintenanceMode: false,
      stripePublishableKey: "",
      stripeEnabled: false
    })
  }
}
