import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { mockFirestore } from '../services/mockFirebase';
import { Listing, ListingType } from '../types';
import { ListingCard } from '../components/ListingCard';
import { Filter, X, Search } from 'lucide-react';

const { useSearchParams } = ReactRouterDOM;

export const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Local state for filters to avoid constant URL updates on type
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minBeds: searchParams.get('minBeds') || '',
    type: searchParams.get('type') || ''
  });

  const fetch = async () => {
    setLoading(true);
    const apiFilters: any = {};
    if (filters.city) apiFilters.city = filters.city;
    if (filters.minPrice) apiFilters.minPrice = Number(filters.minPrice);
    if (filters.maxPrice) apiFilters.maxPrice = Number(filters.maxPrice);
    if (filters.minBeds) apiFilters.minBeds = Number(filters.minBeds);
    if (filters.type) apiFilters.type = filters.type;

    const results = await mockFirestore.getListings(apiFilters);
    setListings(results);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value as string);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ city: '', minPrice: '', maxPrice: '', minBeds: '', type: '' });
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24 transition-colors duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </h3>
              {(filters.city || filters.minPrice || filters.type) && (
                <button onClick={clearFilters} className="text-xs text-brand-600 hover:text-brand-800 dark:text-brand-500 dark:hover:text-brand-400">
                  Clear all
                </button>
              )}
            </div>

            <form onSubmit={applyFilters} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={e => setFilters({...filters, city: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g. New York"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <select
                  value={filters.type}
                  onChange={e => setFilters({...filters, type: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Any</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Price</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={e => setFilters({...filters, minPrice: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Price</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={e => setFilters({...filters, maxPrice: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Bedrooms</label>
                <input
                  type="number"
                  value={filters.minBeds}
                  onChange={e => setFilters({...filters, minBeds: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
              >
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {listings.length} Properties found
            </h1>
            {searchParams.get('city') && (
              <p className="text-gray-500 dark:text-gray-400">Showing results for {searchParams.get('city')}</p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(l => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
              <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
                <Search className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No properties found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
              <div className="mt-6">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-brand-700 bg-brand-100 hover:bg-brand-200 dark:bg-brand-900 dark:text-brand-300 dark:hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
                >
                  <X className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};