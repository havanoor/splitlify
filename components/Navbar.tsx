import { useState } from "react";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import NavBarUserDropDown from "./NavBarUserDropDown";
import { Link } from "@remix-run/react";

export default function NavBar({ username }: { username: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Area */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-[#79AC78] flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                s
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-[#79AC78] transition-colors">
                splitlify
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-[#79AC78] transition-colors">
              Home
            </Link>
            <Link to="#" className="text-sm font-semibold text-gray-600 hover:text-[#79AC78] transition-colors">
              About
            </Link>
            <Link to="#" className="text-sm font-semibold text-gray-600 hover:text-[#79AC78] transition-colors">
              Explore
            </Link>
            <div className="pl-4 border-l border-gray-200">
              <NavBarUserDropDown username={username} />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-4">
            <NavBarUserDropDown username={username} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#79AC78] transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <RxCross2 className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <RxHamburgerMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100 border-b border-gray-100 shadow-lg' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-4 pt-2 pb-6 flex flex-col space-y-2 bg-white/95 backdrop-blur-sm">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-[#79AC78] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-[#79AC78] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-[#79AC78] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Explore
          </Link>
        </div>
      </div>
    </nav>
  );
}
