// Perfiles profesionales sobre localStorage. Se hidratan desde seed la primera
// vez; después los cambios de cada profesional y del admin mandan.

import { professionals as seedProfessionals } from '../data/seed'

const PROS_KEY = 'hogaru_professionals_v2'

function readList(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list))
  } catch {
    // localStorage no disponible — los cambios solo viven en memoria
  }
}

export function priceFromOf(pro) {
  const prices = Object.values(pro.pricing ?? {}).filter((n) => n > 0)
  return prices.length ? Math.min(...prices) : 0
}

function withDerived(pro) {
  return { ...pro, priceFrom: priceFromOf(pro) }
}

function readAll() {
  const list = readList(PROS_KEY, null)
  if (list) return list
  writeList(PROS_KEY, seedProfessionals)
  return seedProfessionals
}

export function getProfessionals() {
  return readAll().map(withDerived)
}

export function getProfessional(id) {
  const pro = readAll().find((p) => p.id === id)
  return pro ? withDerived(pro) : undefined
}

export function createProfessional({ userId, name, zone, service }) {
  const pro = {
    id: `p${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
    userId,
    name,
    photo: `https://i.pravatar.cc/300?u=${encodeURIComponent(userId)}`,
    verified: false,
    rating: 0,
    reviewCount: 0,
    zone,
    bio: '',
    services: [service],
    pricing: {},
    availability: {},
    portfolio: [],
    createdAt: new Date().toISOString(),
  }
  writeList(PROS_KEY, [...readAll(), pro])
  return withDerived(pro)
}

export function updateProfessional(id, patch) {
  const next = readAll().map((p) => (p.id === id ? { ...p, ...patch } : p))
  writeList(PROS_KEY, next)
  return getProfessional(id)
}

export function deleteProfessional(id) {
  writeList(PROS_KEY, readAll().filter((p) => p.id !== id))
}

export function setVerified(id, verified) {
  return updateProfessional(id, { verified })
}

// Una profesional solo es reservable cuando ya definió al menos un servicio con tarifa y un horario.
export function isBookable(pro) {
  return !pro.suspended && priceFromOf(pro) > 0 && Object.values(pro.availability ?? {}).some((slots) => slots.length > 0)
}
