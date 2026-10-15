// Auth local para el MVP — sin backend.
// Usuarios en localStorage (compartidos entre pestañas); la sesión vive en
// sessionStorage para que cada pestaña conserve su propio usuario.
// NOTA: contraseña en texto plano solo para prototipo local.

import { seedUsers } from '../data/seed'
import { createProfessional, deleteProfessional, updateProfessional } from './proStore'
import { getBookings } from './bookingStore'

export const USERS_KEY = 'hogaru_users_v2'
const SESSION_KEY = 'hogaru_session'
const seedIds = new Set(seedUsers.map((u) => u.id))
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // modo privado, etc. — la sesión sigue en memoria en AuthContext
  }
}

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeSession(value) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(value))
  } catch {
    // sin sessionStorage la sesión vive solo en memoria
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // noop
  }
}

function normalize(u) {
  return {
    role: 'cliente',
    verified: seedIds.has(u.id),
    suspended: false,
    ...u,
  }
}

export function getUsers() {
  const users = readJSON(USERS_KEY, null)
  if (!users) {
    writeJSON(USERS_KEY, seedUsers)
    return seedUsers.map(normalize)
  }
  return users.map(normalize)
}

function saveUsers(users) {
  writeJSON(USERS_KEY, users)
}

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

export function findUserByEmail(email) {
  const target = normalizeEmail(email)
  return getUsers().find((u) => u.email.toLowerCase() === target)
}

export function registerUser({ name, email, password, role = 'cliente', service, zone }) {
  const cleanName = name.trim()
  const cleanEmail = normalizeEmail(email)
  if (!cleanName) throw new Error('Cuéntanos tu nombre.')
  if (!EMAIL_RE.test(cleanEmail)) throw new Error('Ese correo no se ve válido.')
  if (!password || password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.')
  if (findUserByEmail(cleanEmail)) throw new Error('Ese correo ya tiene cuenta. Inicia sesión.')
  if (!['cliente', 'profesional'].includes(role)) throw new Error('Elige cómo vas a usar Hogarú.')
  if (role === 'profesional') {
    if (!service) throw new Error('Elige la actividad que realizas.')
    if (!zone?.trim()) throw new Error('Indica en qué zona trabajas.')
  }

  const now = new Date().toISOString()
  const user = {
    id: `u${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
    role,
    name: cleanName,
    email: cleanEmail,
    password,
    verified: false,
    suspended: false,
    createdAt: now,
    lastLoginAt: now,
  }
  if (role === 'profesional') {
    user.professionalId = createProfessional({ userId: user.id, name: cleanName, zone: zone.trim(), service }).id
  }
  saveUsers([...getUsers(), user])
  writeSession({ userId: user.id })
  return publicUser(user)
}

export function loginUser({ email, password, role }) {
  const user = findUserByEmail(email)
  if (!user || user.password !== password) {
    throw new Error('Correo o contraseña incorrectos.')
  }
  if (role && user.role !== role) {
    throw new Error(
      user.role === 'profesional'
        ? 'Esta cuenta es de profesional. Entra desde "Soy profesional".'
        : 'Esta cuenta es de cliente. Entra desde "Iniciar sesión".',
    )
  }
  if (user.suspended) throw new Error('Tu cuenta está suspendida. Contacta a Hogarú.')
  const now = new Date().toISOString()
  saveUsers(getUsers().map((u) => (u.id === user.id ? { ...u, lastLoginAt: now } : u)))
  writeSession({ userId: user.id })
  return publicUser(user)
}

export function logoutUser() {
  clearSession()
}

// Devuelve el usuario de ESTA pestaña, o null si la sesión no existe,
// la cuenta fue eliminada o está suspendida.
export function getSessionUser() {
  const session = readSession()
  if (!session?.userId) return null
  const user = getUsers().find((u) => u.id === session.userId)
  if (!user || user.suspended) {
    clearSession()
    return null
  }
  return publicUser(user)
}

export function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role ?? 'cliente',
    professionalId: user.professionalId ?? null,
    verified: Boolean(user.verified),
  }
}

// ——— Gestión de usuarios (panel admin) ———

function patchUser(id, patch) {
  const users = getUsers()
  if (!users.some((u) => u.id === id)) throw new Error('No encontramos ese usuario.')
  saveUsers(users.map((u) => (u.id === id ? { ...u, ...patch } : u)))
  return getUsers().find((u) => u.id === id)
}

function userBookings(user, bookings) {
  return bookings.filter(
    (b) => b.userId === user.id || (user.professionalId && b.professionalId === user.professionalId),
  )
}

export function listUsers() {
  const bookings = getBookings()
  return getUsers().map((u) => {
    const mine = userBookings(u, bookings)
    return {
      ...u,
      bookingCount: mine.length,
      activeBookingCount: mine.filter((b) => b.status === 'confirmada').length,
    }
  })
}

export function setUserVerified(id, verified) {
  const user = patchUser(id, { verified })
  if (user.professionalId) updateProfessional(user.professionalId, { verified })
  return user
}

export function setUserSuspended(id, suspended) {
  const user = patchUser(id, { suspended })
  if (user.professionalId) updateProfessional(user.professionalId, { suspended })
  return user
}

export function updateUser(id, { name, email }) {
  const cleanName = name.trim()
  const cleanEmail = normalizeEmail(email)
  if (!cleanName) throw new Error('El nombre no puede estar vacío.')
  if (!EMAIL_RE.test(cleanEmail)) throw new Error('Ese correo no se ve válido.')
  const taken = findUserByEmail(cleanEmail)
  if (taken && taken.id !== id) throw new Error('Ese correo ya pertenece a otra cuenta.')
  const user = patchUser(id, { name: cleanName, email: cleanEmail })
  if (user.professionalId) updateProfessional(user.professionalId, { name: cleanName })
  return user
}

export function resetUserPassword(id, password) {
  if (!password || password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.')
  return patchUser(id, { password })
}

export function deleteUser(id) {
  const user = getUsers().find((u) => u.id === id)
  if (!user) throw new Error('No encontramos ese usuario.')
  const open = userBookings(user, getBookings()).filter((b) => b.status === 'confirmada')
  if (open.length > 0) {
    const plural = open.length > 1
    throw new Error(
      `Tiene ${open.length} reserva${plural ? 's' : ''} confirmada${plural ? 's' : ''}. Cancélala${plural ? 's' : ''} antes de eliminar la cuenta.`,
    )
  }
  if (user.professionalId) deleteProfessional(user.professionalId)
  saveUsers(getUsers().filter((u) => u.id !== id))
}
