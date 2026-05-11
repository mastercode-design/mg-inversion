import './globals.css'
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'M.G Inversión',
  description: 'Joyas exclusivas'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          {children}
          <Toaster position="top-center" richColors />
        </CartProvider>
      </body>
    </html>
  )
}