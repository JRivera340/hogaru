// Avisos dentro de la app (profesional → cliente). Sobre localStorage, con
// datos de ejemplo la primera vez.

import { seedNotifications } from '../data/seed'

const NOTIFICATIONS_KEY = 'hogaru_notifications_v3'

function readList() {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY)
    return raw ? JSON.parse(raw) : seedNotifications
  } catch {
    return seedNotifications
  }
}

function writeList(list) {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list))
  } catch {
    // sin localStorage los avisos solo viven en memoria
  }
}

export function notify({ userId, bookingId, type, title, body }) {
  const item = {
    id: `n${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
    userId,
    bookingId,
    type,
    title,
    body,
    createdAt: new Date().toISOString(),
    read: false,
  }
  writeList([...readList(), item])
  return item
}

export function getNotificationsFor(userId) {
  return readList()
    .map((n, i) => ({ n, i }))
    .filter(({ n }) => n.userId === userId)
    .sort((a, b) => new Date(b.n.createdAt) - new Date(a.n.createdAt) || b.i - a.i)
    .map(({ n }) => n)
}

export function unreadCount(userId) {
  return readList().filter((n) => n.userId === userId && !n.read).length
}

export function markAllRead(userId) {
  writeList(readList().map((n) => (n.userId === userId ? { ...n, read: true } : n)))
}
