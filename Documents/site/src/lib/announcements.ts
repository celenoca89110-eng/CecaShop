export interface Announcement {
  id: string
  title: string
  content: string
  active: boolean
  createdAt: string
  discordLink?: string
}

export const announcements: Announcement[] = []
