import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Home, Search, PlusCircle, LogIn, LogOut, User as UserIcon, Sun, Moon, Heart, Info } from 'lucide-react';

const { Link, useLocation } = ReactRouterDOM;

export const Navbar: React.FC = () => {
  const { user, signIn, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) => 
    `px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors ${
      isActive(path)
        ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20 dark:text-brand-400'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800'
    }`;

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 mr-4 sm:mr-0">
              <Home className="h-8 w-8 text-brand-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight hidden sm:block">Hearth & Home</span>
            </Link>
            <div className="ml-4 sm:ml-8 flex space-x-2 sm:space-x-4">
              <Link to="/explore" className={linkClass('/explore')}>
                <Search className="h-4 w-4" />
                Explore
              </Link>
              <Link to="/saved" className={linkClass('/saved')}>
                <Heart className="h-4 w-4" />
                Saved
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
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <UserIcon className="h-5 w-5 bg-gray-100 dark:bg-gray-700 rounded-full p-1" />
                  <span>{user.displayName}</span>
                </div>
                <button
                  onClick={signOut}
                  className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
              >
                <LogIn className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Agent Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};