
import React from 'react';
import { HashRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { CreateListing } from './pages/CreateListing';
import { ListingDetails } from './pages/ListingDetails';
import { SavedListings } from './pages/SavedListings';
import { About } from './pages/About';
import { Agents } from './pages/Agents';
import { Feedback } from './pages/Feedback';
import { ContactUs } from './pages/ContactUs';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { ChatBot } from './components/ChatBot';
import { LiveAssistant } from './components/LiveAssistant';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <ChatBot />
      <LiveAssistant />
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Brand & Social */}
            <div className="md:col-span-2 space-y-4">
               <div className="flex items-center gap-2">
                 <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500 dark:from-white dark:to-gray-200">
                  Hearth & Home
                 </span>
               </div>
               <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                 Find your dream home with the power of AI. We connect you with the best properties, verified agents, and deep neighborhood insights to make your decision easier.
               </p>
               <div className="flex gap-4 pt-2">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110" aria-label="Twitter">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1DA1F2" xmlns="http://www.w3.org/2000/svg">
                       <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110" aria-label="Facebook">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                       <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110" aria-label="Instagram">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <rect width="24" height="24" rx="6" fill="url(#instagram_gradient)"/>
                       <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="white"/>
                       <defs>
                         <linearGradient id="instagram_gradient" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                           <stop stopColor="#f09433"/>
                           <stop offset="0.25" stopColor="#e6683c"/>
                           <stop offset="0.5" stopColor="#dc2743"/>
                           <stop offset="0.75" stopColor="#cc2366"/>
                           <stop offset="1" stopColor="#bc1888"/>
                         </linearGradient>
                       </defs>
                    </svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110" aria-label="LinkedIn">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
                       <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
               </div>
            </div>

            {/* Column 2: Discover */}
             <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Discover</h3>
              <ul className="space-y-3">
                <li><Link to="/explore" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors">Properties</Link></li>
                <li><Link to="/agents" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors">Find an Agent</Link></li>
                <li><Link to="/saved" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors">Saved Homes</Link></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors">Contact</Link></li>
                <li><Link to="/feedback" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors">Feedback</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium text-center md:text-left">
              © 2024 Hearth & Home. Built with React & Gemini.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs text-gray-600 dark:text-gray-400">
               <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white cursor-pointer font-medium transition-colors">Privacy Policy</Link>
               <Link to="/terms" className="hover:text-gray-900 dark:hover:text-white cursor-pointer font-medium transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="saved" element={<SavedListings />} />
              <Route path="agents" element={<Agents />} />
              <Route path="create" element={<CreateListing />} />
              <Route path="listing/:id" element={<ListingDetails />} />
              <Route path="about" element={<About />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
            </Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
