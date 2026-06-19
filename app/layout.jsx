import './globals.css'

export const metadata = {
  title: 'Diagnóstico - Ley 21.719',
  description: 'Diagnóstico interactivo de protección de datos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
