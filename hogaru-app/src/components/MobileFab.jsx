import { motion } from 'framer-motion'

// Botón flotante de acción primaria, solo visible en móvil — la barra
// inferior de escritorio (botón inline) ya cubre pantallas grandes.
export default function MobileFab({ label, onClick, disabled }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      whileTap={{ scale: 0.96 }}
      className="btn-primary fixed inset-x-5 bottom-5 z-40 shadow-lg shadow-ink/15 sm:hidden disabled:shadow-none"
    >
      {label}
    </motion.button>
  )
}
