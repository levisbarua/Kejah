import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { CreateListing } from './pages/CreateListing';
import { ListingDetails } from './pages/ListingDetails';
import { SavedListings } from './pages/SavedListings';
import { About } from './pages/About';
import { Feedback } from './pages/Feedback';
import { ContactUs } from './pages/ContactUs';
import { ChatBot } from './components/ChatBot';

const { HashRouter: Router, Routes, Route, Outlet, Link } = ReactRouterDOM;

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <ChatBot />
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center text-gray-400 dark:text-gray-500 text-sm">
            © 2024 Hearth & Home. Built with React, Tailwind & Gemini.
          </p>
          <div className="flex gap-6">
            <Link to="/about" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">About Us</Link>
            <Link to="/explore" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Properties</Link>
            <Link to="/feedback" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Feedback</Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Contact</Link>
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
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="saved" element={<SavedListings />} />
              <Route path="create" element={<CreateListing />} />
              <Route path="listing/:id" element={<ListingDetails />} />
              <Route path="about" element={<About />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="contact" element={<ContactUs />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;