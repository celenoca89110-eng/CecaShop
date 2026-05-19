"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Announcement } from "@/lib/announcements"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, ToggleLeft, ToggleRight } from "lucide-react"
import { storage, initializeStorage } from "@/lib/storage"
import { sanitize } from "@/lib/validation"

export default function AdminAnnouncementsPage() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    initializeStorage()
    const savedAnnouncements = storage.get('announcements')
    if (savedAnnouncements) {
      setAnnouncements(savedAnnouncements)
    }
  }, [])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState<Partial<Announcement>>({
    title: "",
    content: "",
    active: true,
    discordLink: ""
  })

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id)
  }

  const handleSave = (id: string) => {
    setEditingId(null)
    storage.set('announcements', announcements)
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      const updatedAnnouncements = announcements.filter(a => a.id !== id)
      setAnnouncements(updatedAnnouncements)
      storage.set('announcements', updatedAnnouncements)
    }
  }

  const handleToggleActive = (id: string) => {
    const updatedAnnouncements = announcements.map(a => 
      a.id === id ? { ...a, active: !a.active } : a
    )
    setAnnouncements(updatedAnnouncements)
    storage.set('announcements', updatedAnnouncements)
  }

  const handleAdd = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      const announcement: Announcement = {
        id: Date.now().toString(),
        title: sanitize.text(newAnnouncement.title),
        content: sanitize.text(newAnnouncement.content),
        active: newAnnouncement.active || true,
        createdAt: new Date().toISOString(),
        discordLink: newAnnouncement.discordLink
      }
      const updatedAnnouncements = [...announcements, announcement]
      setAnnouncements(updatedAnnouncements)
      storage.set('announcements', updatedAnnouncements)
      setNewAnnouncement({
        title: "",
        content: "",
        active: true,
        discordLink: ""
      })
      setIsAdding(false)
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setNewAnnouncement({
      title: "",
      content: "",
      active: true,
      discordLink: ""
    })
  }

  const updateAnnouncement = (id: string, field: keyof Announcement, value: string | boolean) => {
    const updatedAnnouncements = announcements.map(a => 
      a.id === id ? { ...a, [field]: typeof value === 'string' ? sanitize.text(value) : value } : a
    )
    setAnnouncements(updatedAnnouncements)
    storage.set('announcements', updatedAnnouncements)
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
          <h1 className="text-2xl font-bold">Gestion des annonces</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="container px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Annonces ({announcements.length})</h2>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une annonce
          </Button>
        </div>

        {/* Add Announcement Form */}
        {isAdding && (
          <Card className="mb-6 border-2 border-primary">
            <CardHeader>
              <CardTitle>Nouvelle annonce</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Titre</label>
                <Input
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Titre de l'annonce"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contenu</label>
                <Input
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="Contenu de l'annonce"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Lien Discord (optionnel)</label>
                <Input
                  value={newAnnouncement.discordLink}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, discordLink: e.target.value })}
                  placeholder="https://discord.gg/..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={newAnnouncement.active}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, active: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="active" className="text-sm font-medium">Activer immédiatement</label>
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

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Aucune annonce pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            announcements.map((announcement) => (
              <Card key={announcement.id} className={!announcement.active ? "opacity-50" : ""}>
                <CardContent className="p-6">
                  {editingId === announcement.id ? (
                    <div className="space-y-3">
                      <Input
                        value={announcement.title}
                        onChange={(e) => updateAnnouncement(announcement.id, "title", e.target.value)}
                        placeholder="Titre"
                      />
                      <Input
                        value={announcement.content}
                        onChange={(e) => updateAnnouncement(announcement.id, "content", e.target.value)}
                        placeholder="Contenu"
                      />
                      <Input
                        value={announcement.discordLink || ""}
                        onChange={(e) => updateAnnouncement(announcement.id, "discordLink", e.target.value)}
                        placeholder="Lien Discord"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={announcement.active}
                          onChange={(e) => updateAnnouncement(announcement.id, "active", e.target.checked)}
                          className="h-4 w-4"
                        />
                        <label className="text-sm font-medium">Actif</label>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave(announcement.id)}>
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
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{announcement.title}</h3>
                          {announcement.active ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Actif</span>
                          ) : (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Inactif</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                        <p className="text-xs text-muted-foreground">
                          Créé le: {new Date(announcement.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleToggleActive(announcement.id)}
                          title={announcement.active ? "Désactiver" : "Activer"}
                        >
                          {announcement.active ? (
                            <ToggleRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                        </Button>
                        <Button size="icon" variant="outline" onClick={() => handleEdit(announcement)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={() => handleDelete(announcement.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
