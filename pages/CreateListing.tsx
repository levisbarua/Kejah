import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockFirestore } from '../services/mockFirebase';
import { useStorage } from '../hooks/useStorage';
import { generateListingDescription } from '../services/geminiService';
import { ListingType } from '../types';
import { Wand2, UploadCloud, Loader2, Smartphone, ShieldCheck } from 'lucide-react';

const { useNavigate } = ReactRouterDOM;

export const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const { user, verifyPhone } = useAuth();
  const { uploadFile, progress } = useStorage();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: ListingType.SALE,
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    city: '',
    state: '',
    address: '',
    amenities: '' // Comma separated
  });

  const [phoneInput, setPhoneInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done'>('idle');

  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500">Please sign in as an agent to list properties.</p>
      </div>
    );
  }

  // Trust & Safety: Phone Verification Gate
  if (!user.phoneNumber) {
    return (
      <div className="max-w-md mx-auto mt-20 px-4">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
           <div className="bg-brand-600 p-6 text-center">
              <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Verify Your Phone</h2>
              <p className="text-brand-100 mt-2 text-sm">To ensure trust and safety in our community, all agents must verify their phone number before posting.</p>
           </div>
           
           <div className="p-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <input 
                type="tel" 
                placeholder="+1 (555) 000-0000"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-3 px-4 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-6"
              />
              <button
                onClick={async () => {
                   if (!phoneInput) return;
                   setIsVerifying(true);
                   try {
                     await verifyPhone(phoneInput);
                   } catch (e) {
                     alert("Verification failed");
                   } finally {
                     setIsVerifying(false);
                   }
                }}
                disabled={isVerifying || !phoneInput}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors disabled:opacity-50"
              >
                {isVerifying ? (
                   <>
                     <Loader2 className="animate-spin h-5 w-5 mr-2" /> Verifying...
                   </>
                ) : 'Send Verification Code'}
              </button>
           </div>
        </div>
      </div>
    );
  }

  const handleAiGenerate = async () => {
    if (!formData.city || !formData.type) {
      alert("Please enter at least City and Type to generate a description.");
      return;
    }
    setIsGenerating(true);
    const amenitiesList = formData.amenities.split(',').filter(s => s.trim());
    const features = [
      `${formData.bedrooms} bed`,
      `${formData.bathrooms} bath`,
      ...amenitiesList
    ];
    
    const desc = await generateListingDescription(features, formData.type, formData.city);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate image upload automatically for demo
      setUploadStatus('uploading');
      const mockImage = await uploadFile(new File([""], "mock.png"));
      setUploadStatus('done');

      await mockFirestore.addListing({
        creatorId: user.uid,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        type: formData.type,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        sqft: Number(formData.sqft),
        amenities: formData.amenities.split(',').map(s => s.trim()),
        imageUrls: [mockImage], // In real app, this would be an array of uploaded URLs
        location: {
          lat: 0, lng: 0, // Mock lat/lng
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: '00000'
        }
      });

      navigate('/explore');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-brand-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">List a New Property</h2>
            <p className="text-brand-100 text-sm">Fill in the details below to publish your listing.</p>
          </div>
          <div className="flex items-center gap-1 bg-brand-700/50 px-3 py-1 rounded-full text-xs text-brand-100 border border-brand-500">
             <ShieldCheck className="h-3 w-3" /> Phone Verified
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Property Title</label>
              <input
                required
                type="text"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as ListingType })}
              >
                <option value={ListingType.SALE}>For Sale</option>
                <option value={ListingType.RENT}>For Rent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price ($)</label>
              <input required type="number" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                 value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bedrooms</label>
              <input required type="number" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                 value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bathrooms</label>
              <input required type="number" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                 value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
               <input required type="text" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                  value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sqft</label>
               <input required type="number" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                  value={formData.sqft} onChange={e => setFormData({...formData, sqft: e.target.value})} />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amenities (comma separated)</label>
             <input type="text" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                placeholder="Pool, Gym, Parking"
                value={formData.amenities} onChange={e => setFormData({...formData, amenities: e.target.value})} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <button 
                type="button" 
                onClick={handleAiGenerate}
                disabled={isGenerating}
                className="text-xs flex items-center gap-1 text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded-md transition-colors"
              >
                {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                Generate with AI
              </button>
            </div>
            <textarea
              required
              rows={4}
              className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the property..."
            />
          </div>

          {/* Image Upload Area - Simplified for Demo */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex justify-center items-center hover:border-brand-500 dark:hover:border-brand-500 transition-colors">
             <div className="text-center">
               <UploadCloud className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
               <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                 {uploadStatus === 'uploading' 
                    ? `Uploading... ${progress}%` 
                    : uploadStatus === 'done' 
                      ? 'Image added!' 
                      : 'Mock Upload: Submitting will auto-generate an image.'}
               </p>
             </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};