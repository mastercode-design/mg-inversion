import { FaInstagram } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="p-6">
      <a 
        href="https://instagram.com/MG.INVERSION" 
        target="_blank"
        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 px-4 py-2 rounded-full text-white font-bold w-fit"
      >
        <FaInstagram size={20} /> Síguenos @MG.INVERSION
      </a>
    </header>
  );
}