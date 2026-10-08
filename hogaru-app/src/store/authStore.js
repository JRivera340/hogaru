// Auth local para el MVP — sin backend.
// Usuarios en localStorage, sesión en localStorage para persistir al recargar.
// NOTA: contraseña en texto plano solo para prototipo local.

const USERS_KEY = 'hogaru_users'
const SESSION_KEY = 'hogaru_session'

const seedUsers = [
  {
    id: 'u1',
    name: 'Juan Camilo Restrepo',
    email: 'juanc.restrepo@example.com',
    password: 'demo1234',
    createdAt: '2026-09-01T10:00:00-05:00',
  },
]

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

export function getUsers() {
  const users = readJSON(USERS_KEY, null)
  if (!users) {
    writeJSON(USERS_KEY, seedUsers)
    return [...seedUsers]
  }
  return users
}

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

export function findUserByEmail(email) {
  const target = normalizeEmail(email)
  return getUsers().find((u) => u.email.toLowerCase() === target)
}

export function registerUser({ name, email, password }) {
  const cleanName = name.trim()
  const cleanEmail = normalizeEmail(email)
  if (!cleanName) throw new Error('Cuéntanos tu nombre.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error('Ese correo no se ve válido.')
  if (!password || password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.')
  if (findUserByEmail(cleanEmail)) throw new Error('Ese correo ya tiene cuenta. Inicia sesión.')

  const user = {
    id: `u${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    password,
    createdAt: new Date().toISOString(),
  }
  const users = getUsers()
  writeJSON(USERS_KEY, [...users, user])
  writeJSON(SESSION_KEY, { userId: user.id })
  return publicUser(user)
}

export function loginUser({ email, password }) {
  const user = findUserByEmail(email)
  if (!user || user.password !== password) {
    throw new Error('Correo o contraseña incorrectos.')
  }
  writeJSON(SESSION_KEY, { userId: user.id })
  return publicUser(user)
}

export function logoutUser() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // noop
  }
}

export function getSessionUser() {
  const session = readJSON(SESSION_KEY, null)
  if (!session?.userId) return null
  const user = getUsers().find((u) => u.id === session.userId)
  return user ? publicUser(user) : null
}

export function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email }
}
