export default function Stars({ value, size = 'text-sm' }) {
  const full = Math.round(value)
  return (
    <span className={`inline-flex items-center gap-0.5 ${size}`} aria-label={`${value} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          width="1em"
          height="1em"
          fill={i < full ? '#C9992B' : '#D7DED3'}
          aria-hidden="true"
        >
          <path d="M10 1.5l2.47 5.24 5.78.62-4.31 3.94 1.19 5.7L10 14.9l-5.13 2.1 1.19-5.7L1.75 7.36l5.78-.62L10 1.5z" />
        </svg>
      ))}
    </span>
  )
}
