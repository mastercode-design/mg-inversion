import './globals.css'

export const metadata = {
  title: 'M.G Inversion - Luxury Jewelry',
  description: 'Joyas exclusivas de lujo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}