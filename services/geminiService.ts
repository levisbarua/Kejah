import { GoogleGenAI, Type, Chat } from "@google/genai";
import { FilterState, ListingType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Feature 1: Convert natural language to structured filters
export const extractFiltersFromQuery = async (query: string): Promise<FilterState> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract housing search filters from this query: "${query}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            city: { type: Type.STRING },
            minPrice: { type: Type.NUMBER },
            maxPrice: { type: Type.NUMBER },
            minBeds: { type: Type.NUMBER },
            type: { type: Type.STRING, enum: ["sale", "rent"] }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return {};
    
    const data = JSON.parse(text);
    
    // Map string enum back to ListingType if needed
    if (data.type === 'sale') data.type = ListingType.SALE;
    else if (data.type === 'rent') data.type = ListingType.RENT;
    else delete data.type;

    return data;
  } catch (error) {
    console.error("Gemini Filter Extraction Error:", error);
    return {};
  }
};

// Feature 2: Generate a compelling description for a property
export const generateListingDescription = async (
  features: string[],
  type: string,
  city: string
): Promise<string> => {
  try {
    const prompt = `Write a compelling, professional real estate listing description (max 100 words) for a ${type} in ${city}.
    Key features: ${features.join(', ')}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Description unavailable.";
  } catch (error) {
    console.error("Gemini Description Error:", error);
    return "Beautiful property waiting for you.";
  }
};

// Feature 3: AI Chatbot
let chatSession: Chat | null = null;

export interface ChatMessageResponse {
  text: string;
  sources?: { title: string; uri: string }[];
}

export const sendChatMessage = async (message: string): Promise<ChatMessageResponse> => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are a helpful, friendly, and professional real estate assistant for the 'Hearth & Home' app. Assist users with questions about buying, renting, mortgages, and market trends. Keep answers concise (under 3 sentences) unless asked for details.",
        // Removed googleSearch tool because it frequently causes 403 Permission Denied 
        // in environments where the API Key project doesn't have the Search tool enabled.
        tools: [], 
      }
    });
  }

  try {
    const result = await chatSession.sendMessage({ message });
    
    const sources: { title: string; uri: string }[] = [];
    const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    chunks.forEach((chunk: any) => {
      if (chunk.web?.uri && chunk.web?.title) {
        sources.push({ title: chunk.web.title, uri: chunk.web.uri });
      }
    });

    return { 
      text: result.text || "I'm not sure how to respond to that.",
      sources: sources.length > 0 ? sources : undefined
    };
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    
    if (error?.message?.includes('403') || error?.message?.includes('PERMISSION_DENIED')) {
      chatSession = null;
      return { text: "I'm sorry, I'm currently unable to access some of my advanced search features. I can still answer general real estate questions for you!" };
    }
    
    chatSession = null;
    return { text: "I'm having trouble connecting to the network. Please try again." };
  }
};

// Feature 4: Maps Grounding for Neighborhood Insights
export interface GroundingLink {
  title: string;
  uri: string;
}

export interface NeighborhoodInsight {
  text: string;
  links: GroundingLink[];
}

export const getNeighborhoodInsights = async (address: string, topic: string): Promise<NeighborhoodInsight> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Tell me about ${topic} near ${address}. Be specific and mention actual places.`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const text = response.text || "No insights available.";
    const links: GroundingLink[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    chunks.forEach((chunk: any) => {
      if (chunk.web?.uri && chunk.web?.title) {
        links.push({ title: chunk.web.title, uri: chunk.web.uri });
      } else if (chunk.maps?.uri && chunk.maps?.title) {
        links.push({ title: chunk.maps.title, uri: chunk.maps.uri });
      }
    });

    return { text, links };
  } catch (error: any) {
    console.error("Gemini Maps Grounding Error:", error);
    if (error?.message?.includes('403')) {
        return { 
          text: "I couldn't load specific neighborhood map data, but generally this area has local facilities nearby.", 
          links: [] 
        };
    }
    return { text: "Unable to load neighborhood insights at this time.", links: [] };
  }
};

// Feature 5: Generate Welcome Message for New Signups
export const generateWelcomeMessage = async (userName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, warm, and professional welcome message (max 2 sentences) for a new user named "${userName}" joining "Hearth & Home", an AI-powered real estate platform.`,
    });
    return response.text || `Welcome to Hearth & Home, ${userName}!`;
  } catch (error) {
    return `Welcome to Hearth & Home, ${userName}!`;
  }
};