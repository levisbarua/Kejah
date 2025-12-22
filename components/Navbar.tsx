import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Home, Search, PlusCircle, LogIn, LogOut, User as UserIcon, Sun, Moon, Heart, Info, Menu, X, Users } from 'lucide-react';

const { Link, useLocation } = ReactRouterDOM;

export const Navbar: React.FC = () => {
  const { user, signIn, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) => 
    `px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
      isActive(path)
        ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20 dark:text-brand-400'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800'
    }`;

  const mobileLinkClass = (path: string) => 
    `block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 transition-colors ${
      isActive(path)
        ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20 dark:text-brand-400'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
    }`;

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Nav */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 mr-4" onClick={() => setIsMobileMenuOpen(false)}>
              <Home className="h-8 w-8 text-brand-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight hidden sm:block">Hearth & Home</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-8 space-x-2">
              <Link to="/explore" className={linkClass('/explore')}>
                <Search className="h-4 w-4" />
                Explore
              </Link>
              <Link to="/saved" className={linkClass('/saved')}>
                <Heart className="h-4 w-4" />
                Saved
              </Link>
              <Link to="/agents" className={linkClass('/agents')}>
                <Users className="h-4 w-4" />
                Agents
              </Link>
              <Link to="/about" className={linkClass('/about')}>
                <Info className="h-4 w-4" />
                About
              </Link>
              {user && (
                <Link to="/create" className={linkClass('/create')}>
                  <PlusCircle className="h-4 w-4" />
                  List Property
                </Link>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <UserIcon className="h-5 w-5 bg-gray-100 dark:bg-gray-700 rounded-full p-1" />
                  <span className="max-w-[100px] truncate">{user.displayName}</span>
                </div>
                <button
                  onClick={signOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                className="hidden md:inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Agent Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center">
               <button
                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                 className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
                 aria-expanded="false"
               >
                 <span className="sr-only">Open main menu</span>
                 {isMobileMenuOpen ? (
                   <X className="block h-6 w-6" aria-hidden="true" />
                 ) : (
                   <Menu className="block h-6 w-6" aria-hidden="true" />
                 )}
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/explore" className={mobileLinkClass('/explore')} onClick={() => setIsMobileMenuOpen(false)}>
              <Search className="h-5 w-5" />
              Explore
            </Link>
            <Link to="/saved" className={mobileLinkClass('/saved')} onClick={() => setIsMobileMenuOpen(false)}>
              <Heart className="h-5 w-5" />
              Saved Properties
            </Link>
            <Link to="/agents" className={mobileLinkClass('/agents')} onClick={() => setIsMobileMenuOpen(false)}>
              <Users className="h-5 w-5" />
              Agents
            </Link>
             <Link to="/about" className={mobileLinkClass('/about')} onClick={() => setIsMobileMenuOpen(false)}>
              <Info className="h-5 w-5" />
              About Us
            </Link>
            {user && (
              <Link to="/create" className={mobileLinkClass('/create')} onClick={() => setIsMobileMenuOpen(false)}>
                <PlusCircle className="h-5 w-5" />
                List Property
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            {user ? (
              <div className="px-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                     <UserIcon className="h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-full p-1.5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className="text-base font-medium text-gray-800 dark:text-white truncate">
                    {user.displayName}
                  </div>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-2 flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>
            ) : (
               <div className="px-4">
                 <button
                   onClick={() => {
                     signIn();
                     setIsMobileMenuOpen(false);
                   }}
                   className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-600 hover:bg-brand-700"
                 >
                   <LogIn className="h-5 w-5 mr-2" />
                   Agent Login
                 </button>
               </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};