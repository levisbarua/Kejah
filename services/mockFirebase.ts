import { Listing, ListingType, User, UserRole, FeedbackData } from '../types';

// ... (Security Rules comments remain conceptually same)

const MOCK_USER: User = {
  uid: 'user_123',
  email: 'demo@agent.com',
  displayName: 'Demo Agent',
  role: UserRole.AGENT,
  photoURL: 'https://picsum.photos/id/64/100/100',
  isVerified: true, // Mock user is a Verified Agent
  phoneNumber: '' // Initially empty to demonstrate verification flow
};

// Generating 16 listings as requested: 4 Bedsitters, 4 1-Bed, 4 2-Bed, 4 3-Bed
// Added default status: 'active' and reportCount: 0
const MOCK_LISTINGS: Listing[] = [
  // --- 4 BEDSITTERS (Studios) ---
  {
    id: 'bs1', creatorId: 'user_123', type: ListingType.RENT,
    title: 'Cozy Downtown Bedsitter',
    description: 'Efficient bedsitter unit perfect for a student or young professional. Includes kitchenette and shared laundry.',
    price: 800, bedrooms: 0, bathrooms: 1, sqft: 350,
    amenities: ['WiFi', 'Shared Laundry', 'Furnished'],
    imageUrls: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    location: { lat: 40.7128, lng: -74.0060, address: '101 Studio Ln', city: 'New York', state: 'NY', zip: '10001' },
    createdAt: Date.now(), status: 'active', reportCount: 0
  },
  {
    id: 'bs2', creatorId: 'user_123', type: ListingType.RENT,
    title: 'Modern Micro-Studio',
    description: 'Compact living at its finest. This bedsitter features smart storage solutions and a fold-away Murphy bed.',
    price: 950, bedrooms: 0, bathrooms: 1, sqft: 300,
    amenities: ['Smart Home', 'Bike Storage', 'Gym'],
    imageUrls: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'],
    location: { lat: 34.0522, lng: -118.2437, address: '55 Micro St', city: 'Los Angeles', state: 'CA', zip: '90012' },
    createdAt: Date.now() - 10000, status: 'active', reportCount: 0
  },
  {
    id: 'bs3', creatorId: 'user_123', type: ListingType.RENT,
    title: 'Sunny Garden Bedsitter',
    description: 'A bright and airy bedsitter with direct access to a community garden. Quiet neighborhood.',
    price: 750, bedrooms: 0, bathrooms: 1, sqft: 400,
    amenities: ['Garden Access', 'Pet Friendly', 'Parking'],
    imageUrls: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800'],
    location: { lat: 30.2672, lng: -97.7431, address: '88 Green Way', city: 'Austin', state: 'TX', zip: '78701' },
    createdAt: Date.now() - 20000, status: 'active', reportCount: 0
  },
  {
    id: 'bs4', creatorId: 'user_123', type: ListingType.RENT,
    title: 'Industrial Loft Bedsitter',
    description: 'Converted warehouse space with high ceilings and exposed brick. Open plan bedsitter layout.',
    price: 1100, bedrooms: 0, bathrooms: 1, sqft: 500,
    amenities: ['Elevator', 'Roof Deck', 'AC'],
    imageUrls: ['https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop'],
    location: { lat: 41.8781, lng: -87.6298, address: '404 Brick Rd', city: 'Chicago', state: 'IL', zip: '60601' },
    createdAt: Date.now() - 30000, status: 'active', reportCount: 0
  },

  // --- 4 ONE BEDROOMS ---
  {
    id: '1b1', creatorId: 'user_123', type: ListingType.SALE,
    title: 'Chic City 1-Bed Apartment',
    description: 'Beautifully renovated 1-bedroom apartment in the heart of the business district. Great investment.',
    price: 350000, bedrooms: 1, bathrooms: 1, sqft: 750,
    amenities: ['Balcony', 'Concierge', 'Pool'],
    imageUrls: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop'],
    location: { lat: 25.7617, lng: -80.1918, address: '12 Palm Blvd', city: 'Miami', state: 'FL', zip: '33101' },
    createdAt: Date.now() - 40000, status: 'active', reportCount: 0
  },
  {
    id: '1b2', creatorId: 'user_123', type: ListingType.RENT,
    title: 'Spacious 1-Bedroom Condo',
    description: 'Large 1-bedroom unit with a walk-in closet and updated kitchen appliances.',
    price: 1800, bedrooms: 1, bathrooms: 1.5, sqft: 850,
    amenities: ['Dishwasher', 'In-unit Laundry', 'Gym'],
    imageUrls: ['https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800'],
    location: { lat: 47.6062, lng: -122.3321, address: '303 Rain St', city: 'Seattle', state: 'WA', zip: '98101' },
    createdAt: Date.now() - 50000, status: 'active', reportCount: 0
  },
  {
    id: '1b3', creatorId: 'user_123', type: ListingType.RENT,
    title: 'Vintage 1-Bed Walkup',
    description: 'Charming 1-bedroom in a historic building. Hardwood floors and original crown molding.',
    price: 1500, bedrooms: 1, bathrooms: 1, sqft: 700,
    amenities: ['Hardwood Floors', 'Cat Friendly', 'Heat Included'],
    imageUrls: ['https://images.unsplash.com/photo-1499916078039-922301b0eb9b?w=800', 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800'],
    location: { lat: 42.3601, lng: -71.0589, address: '76 Old Town', city: 'Boston', state: 'MA', zip: '02108' },
    createdAt: Date.now() - 60000, status: 'active', reportCount: 0
  },
  {
    id: '1b4', creatorId: 'user_123', type: ListingType.SALE,
    title: 'Luxury 1-Bed Highrise',
    description: 'Stunning views from the 30th floor. This 1-bedroom features floor-to-ceiling windows and premium finishes.',
    price: 550000, bedrooms: 1, bathrooms: 1, sqft: 900,
    amenities: ['Doorman', 'Valet', 'Spa'],
    imageUrls: ['https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800', 'https://images.unsplash.com/photo-1522050212171-61b01dd24579?w=800'],
    location: { lat: 37.7749, lng: -122.4194, address: '99 Cloud Way', city: 'San Francisco', state: 'CA', zip: '94105' },
    createdAt: Date.now() - 70000, status: 'active', reportCount: 0
  },

  // --- 4 TWO BEDROOMS ---
  {
    id: '2b1', creatorId: 'user_123', type: ListingType.SALE,
    title: 'Modern 2-Bed Townhouse',
    description: 'Two-story townhouse with a private patio and attached garage. Ideal for small families.',
    price: 420000, bedrooms: 2, bathrooms: 2, sqft: 1200,
    amenities: ['Garage', 'Patio', 'Stainless Steel'],
    imageUrls: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800'],
    location: { lat: 39.7392, lng: -104.9903, address: '22 Mountain View', city: 'Denver', state: 'CO', zip: '80202' },
    createdAt: Date.now() - 80000, status: 'active', reportCount: 0
  },
  {
    id: '2b2', creatorId: 'user_123', type: ListingType.RENT,
    title: '2-Bedroom Garden Apartment',
    description: 'Quiet 2-bedroom unit in a garden complex. Features a renovated kitchen and large living area.',
    price: 2100, bedrooms: 2, bathrooms: 1.5, sqft: 1100,
    amenities: ['Pool', 'Tennis Court', 'Playground'],
    imageUrls: ['https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800', 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=800'],
    location: { lat: 33.4484, lng: -112.0740, address: '88 Cactus Dr', city: 'Phoenix', state: 'AZ', zip: '85001' },
    createdAt: Date.now() - 90000, status: 'active', reportCount: 0
  },
  {
    id: '2b3', creatorId: 'user_123', type: ListingType.SALE,
    title: 'Historic 2-Bed Bungalow',
    description: 'Charming bungalow with original details, large front porch, and updated systems.',
    price: 380000, bedrooms: 2, bathrooms: 1, sqft: 1000,
    amenities: ['Porch', 'Fireplace', 'Fenced Yard'],
    imageUrls: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800'],
    location: { lat: 36.1627, lng: -86.7816, address: '45 Music Row', city: 'Nashville', state: 'TN', zip: '37203' },
    createdAt: Date.now() - 100000, status: 'active', reportCount: 0
  },
  {
    id: '2b4', creatorId: 'user_123', type: ListingType.RENT,
    title: 'Sleek 2-Bed Condo',
    description: 'Contemporary 2-bedroom condo with floor-to-ceiling glass and high-end finishes.',
    price: 2800, bedrooms: 2, bathrooms: 2, sqft: 1300,
    amenities: ['Gym', 'Concierge', 'Rooftop'],
    imageUrls: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800'],
    location: { lat: 32.7767, lng: -96.7970, address: '909 Elm St', city: 'Dallas', state: 'TX', zip: '75201' },
    createdAt: Date.now() - 110000, status: 'active', reportCount: 0
  },

  // --- 4 THREE BEDROOMS ---
  {
    id: '3b1', creatorId: 'user_123', type: ListingType.SALE,
    title: 'Spacious 3-Bed Family Home',
    description: 'Large 3-bedroom house in a great school district. Features a huge backyard and open kitchen.',
    price: 650000, bedrooms: 3, bathrooms: 2.5, sqft: 2200,
    amenities: ['Backyard', 'School District', 'Double Garage'],
    imageUrls: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', 'https://images.unsplash.com/photo-1556912173-3db9963ee790?w=800'],
    location: { lat: 33.7490, lng: -84.3880, address: '50 Peach Tree', city: 'Atlanta', state: 'GA', zip: '30303' },
    createdAt: Date.now() - 120000, status: 'active', reportCount: 0
  },
  {
    id: '3b2', creatorId: 'user_123', type: ListingType.RENT,
    title: '3-Bed Penthouse Suite',
    description: 'Exclusive penthouse with 3 bedrooms, wrap-around balcony, and panoramic city views.',
    price: 6000, bedrooms: 3, bathrooms: 3, sqft: 2500,
    amenities: ['Penthouse', 'Views', 'Private Elevator'],
    imageUrls: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    location: { lat: 40.7128, lng: -74.0060, address: '1 Park Ave', city: 'New York', state: 'NY', zip: '10016' },
    createdAt: Date.now() - 130000, status: 'active', reportCount: 0
  },
  {
    id: '3b3', creatorId: 'user_123', type: ListingType.SALE,
    title: 'Renovated 3-Bed Farmhouse',
    description: 'Beautifully updated farmhouse on 2 acres of land. 3 bedrooms, modern kitchen, and rustic charm.',
    price: 450000, bedrooms: 3, bathrooms: 2, sqft: 2000,
    amenities: ['Acreage', 'Barn', 'Renovated'],
    imageUrls: ['https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
    location: { lat: 45.5051, lng: -122.6750, address: '888 Country Rd', city: 'Portland', state: 'OR', zip: '97204' },
    createdAt: Date.now() - 140000, status: 'active', reportCount: 0
  },
  {
    id: '3b4', creatorId: 'user_123', type: ListingType.RENT,
    title: '3-Bedroom Suburban Retreat',
    description: 'Quiet suburban home with 3 bedrooms, perfect for a growing family. Close to parks and shops.',
    price: 2400, bedrooms: 3, bathrooms: 2, sqft: 1800,
    amenities: ['Quiet Street', 'Deck', 'Central Air'],
    imageUrls: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&auto=format&fit=crop'],
    location: { lat: 35.2271, lng: -80.8431, address: '777 Oak Ln', city: 'Charlotte', state: 'NC', zip: '28202' },
    createdAt: Date.now() - 150000, status: 'active', reportCount: 0
  }
];

export const mockAuth = {
  currentUser: null as User | null,
  login: async () => {
    mockAuth.currentUser = MOCK_USER;
    return MOCK_USER;
  },
  logout: async () => {
    mockAuth.currentUser = null;
  },
  verifyPhone: async (phoneNumber: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate SMS Code
    if (mockAuth.currentUser) {
      mockAuth.currentUser = { ...mockAuth.currentUser, phoneNumber };
      return mockAuth.currentUser;
    }
    throw new Error("No user logged in");
  }
};

export const mockFirestore = {
  getListings: async (filters: any) => {
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network latency
    // Filter out suspended listings for the feed
    let results = MOCK_LISTINGS.filter(l => l.status !== 'suspended');

    // Simulate Firestore Compound Queries
    if (filters.type) {
      results = results.filter(l => l.type === filters.type);
    }
    if (filters.minPrice) {
      results = results.filter(l => l.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      results = results.filter(l => l.price <= filters.maxPrice);
    }
    if (filters.city) {
      results = results.filter(l => l.location.city.toLowerCase().includes(filters.city.toLowerCase()));
    }
    if (filters.minBeds) {
      results = results.filter(l => l.bedrooms >= filters.minBeds);
    }
    
    return results;
  },
  
  getListingById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Even if suspended, we might want to return it but handle UI differently, 
    // but for now, we'll return it as is.
    return MOCK_LISTINGS.find(l => l.id === id) || null;
  },

  addListing: async (listing: Omit<Listing, 'id' | 'createdAt' | 'status' | 'reportCount'>) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newListing: Listing = {
      ...listing,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      status: 'active',
      reportCount: 0
    };
    MOCK_LISTINGS.unshift(newListing);
    return newListing;
  },

  reportListing: async (listingId: string, reason: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const listingIndex = MOCK_LISTINGS.findIndex(l => l.id === listingId);
    
    if (listingIndex !== -1) {
      const listing = MOCK_LISTINGS[listingIndex];
      listing.reportCount += 1;
      
      // Trust & Safety: Automatic Suspension rule
      if (listing.reportCount >= 3) {
        listing.status = 'suspended';
      }
      return listing;
    }
    throw new Error("Listing not found");
  },

  addFeedback: async (feedback: FeedbackData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Feedback submitted:", feedback);
    return { success: true };
  },

  submitContactMessage: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Contact message submitted:", data);
    return { success: true };
  }
};

export const mockStorage = {
  uploadImage: async (file: File): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload
    // Return a random image since we can't actually host user files
    const id = Math.floor(Math.random() * 100);
    return `https://picsum.photos/id/${id}/800/600`;
  }
};