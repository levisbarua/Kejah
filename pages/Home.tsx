import React, { useEffect, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { mockFirestore } from '../services/mockFirebase';
import { extractFiltersFromQuery } from '../services/geminiService';
import { Listing, FilterState } from '../types';
import { ListingCard } from '../components/ListingCard';

const { Link, useNavigate } = ReactRouterDOM;

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);

  useEffect(() => {
    mockFirestore.getListings({}).then(listings => {
      setFeaturedListings(listings.slice(0, 3));
    });
  }, []);

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsAiSearching(true);
    // Use Gemini to convert "Cheap 2 bed in Austin" -> Filters
    const filters = await extractFiltersFromQuery(searchQuery);
    setIsAiSearching(false);

    // Serialize filters to URL search params
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.minBeds) params.set('minBeds', filters.minBeds.toString());
    if (filters.type) params.set('type', filters.type);

    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Hero Section */}
      <div className="relative bg-brand-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury home exterior with garden"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900 to-brand-800 opacity-90 mix-blend-multiply"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-32 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find your place, <span className="text-brand-300">faster.</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-brand-100 max-w-3xl">
            Experience the future of house hunting. Use our AI-powered search to describe exactly what you're looking for, or browse our curated listings.
          </p>
          
          <div className="mt-8 sm:mt-10 max-w-2xl w-full">
            <form onSubmit={handleAiSearch} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-400 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-2 gap-2 transition-colors">
                <div className="flex items-center flex-1 px-2">
                   <Sparkles className={`h-5 w-5 flex-shrink-0 ${isAiSearching ? 'text-brand-500 animate-pulse' : 'text-gray-400'}`} />
                   <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-4 py-3 text-base"
                    placeholder="Describe your dream home... (e.g. 'Modern 2-bed in Nairobi')"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAiSearching}
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors w-full sm:w-auto shadow-sm"
                >
                  {isAiSearching ? (
                    <>
                       <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"/>
                       Thinking...
                    </>
                  ) : 'Search'}
                </button>
              </div>
            </form>
            <p className="mt-3 text-sm text-brand-100/80 flex items-center justify-center gap-1.5 font-medium">
              <Sparkles className="h-4 w-4" /> Powered by Gemini
            </p>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Featured Listings</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Hand-picked properties just for you.</p>
          </div>
          <Link to="/explore" className="text-brand-600 font-medium hover:text-brand-700 dark:text-brand-500 dark:hover:text-brand-400 flex items-center">
            View all listings <span aria-hidden="true" className="ml-1">&rarr;</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
};