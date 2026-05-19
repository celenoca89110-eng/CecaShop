export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  isSubscription?: boolean
  subscriptionDuration?: string // "monthly", "yearly", "lifetime"
}

export const products: Product[] = [
  {
    id: "1",
    name: "Discord Bot Premium",
    description: "Bot Discord complet avec modération, musique, et économie. Configuration personnalisable incluse.",
    price: 29.99,
    category: "Bots",
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=300&fit=crop",
    stock: 50
  },
  {
    id: "2",
    name: "Telegram Bot Pro",
    description: "Bot Telegram avancé avec automatisation, marketing et support client. API complète.",
    price: 24.99,
    category: "Bots",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
    stock: 35
  },
  {
    id: "3",
    name: "Twitter Bot Automation",
    description: "Bot pour automatiser vos tweets, analyser les tendances et gérer votre communauté.",
    price: 19.99,
    category: "Bots",
    image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400&h=300&fit=crop",
    stock: 40
  },
  {
    id: "4",
    name: "API Key Management",
    description: "Système complet de gestion des clés API avec authentification et monitoring.",
    price: 49.99,
    category: "Outils",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    stock: 25
  },
  {
    id: "5",
    name: "Bot Template Pack",
    description: "Pack de 10 templates de bots prêts à l'emploi pour différentes plateformes.",
    price: 39.99,
    category: "Templates",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    stock: 100
  },
  {
    id: "6",
    name: "Custom Bot Development",
    description: "Développement d'un bot sur mesure selon vos besoins spécifiques.",
    price: 149.99,
    category: "Services",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    stock: 10
  },
  {
    id: "7",
    name: "Bot Hosting Premium",
    description: "Hébergement premium pour vos bots avec 99.9% uptime et support 24/7.",
    price: 14.99,
    category: "Services",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
    stock: 200
  },
  {
    id: "8",
    name: "Bot Analytics Dashboard",
    description: "Dashboard d'analyse pour suivre les performances de vos bots en temps réel.",
    price: 34.99,
    category: "Outils",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    stock: 45
  }
]

export const categories = ["Tous", "Bots", "Outils", "Templates", "Services"]
