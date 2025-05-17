import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button'; 
// import logo from './assets/rythme-logo.png'; // Import your logo

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/aboutus" },
    { name: "Classes", href: "/classes" },
    { name: "Event", href: "/events" },
    { name: "Page", href: "/page" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-black  shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo with text */}
          <Link to="/" className="flex items-center gap-3">
            {/* Logo image */}
            <img 
            src='/ab-removebg-preview.png'
              alt="Rythme Music School Logo" 
              className="h-10 w-10 object-contain"
            />
            <div className="text-xl font-bold">
              <span className="text-red-400">CP</span>
              <span className="text-white"> SNGEETHA</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-amber-600 hover:text-red-900 font-medium transition-colors text-sm uppercase tracking-wider"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}