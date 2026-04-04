import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Property from './models/Property.js';
import User from './models/User.js';

dotenv.config();
connectDB();

const sampleProperties = [
  { 
    name: "The Palm Oasis Villa", price: "$12,500,000", location: "Dubai, UAE", 
    image: "https://images.unsplash.com/photo-1613490900233-08ed28bc991a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", 
    featured: true, aqi: 42, noise: "35dB", investmentGrade: "A+", growthPercentage: 14.2,
    amenities: ["Private Beach Access", "Infinity Pool", "Home Cinema", "Smart Home Integration"],
    description: "An architectural masterpiece offering uninterrupted sunset views over the water. Built to the highest standards of luxury."
  },
  { 
    name: "Skyline Infinity Penthouse", price: "$8,200,000", location: "New York, USA", 
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", 
    featured: false, aqi: 55, noise: "40dB", investmentGrade: "A", growthPercentage: 8.4,
    amenities: ["Floor-to-ceiling Windows", "Private Gym", "Wine Cellar", "24/7 Concierge"],
    description: "Towering above Manhattan, this penthouse offers 360-degree views of the iconic skyline with ultra-modern finishes."
  },
  { 
    name: "Coastal Glass Mansion", price: "$15,400,000", location: "Malibu, USA", 
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", 
    featured: false, aqi: 30, noise: "30dB", investmentGrade: "A+", growthPercentage: 12.1,
    amenities: ["Oceanfront Deck", "Recording Studio", "Zen Garden", "Helipad Access"],
    description: "A sanctuary of glass and steel perched on the cliffs of Malibu, harmonizing indoor elegance with raw coastal beauty."
  },
  { 
    name: "Alpine Modern Ski Retreat", price: "$9,800,000", location: "Zermatt, CH", 
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", 
    featured: false, aqi: 20, noise: "25dB", investmentGrade: "B+", growthPercentage: 6.5,
    amenities: ["Ski-in/Ski-out", "Heated Indoor Pool", "Sauna & Spa", "Heated Driveway"],
    description: "A minimalist approach to the classic alpine chalet. Features panoramic views of the Matterhorn from every room."
  },
  {
    name: "Haussmann Luxury Suite", price: "$5,400,000", location: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    featured: false, aqi: 45, noise: "38dB", investmentGrade: "A", growthPercentage: 4.2,
    amenities: ["Balcony with Eiffel View", "Wine Storage", "Chef's Kitchen"],
    description: "Elegant Parisian living in the heart of the 8th arrondissement. High ceilings and original marble fireplaces."
  },
  {
    name: "Shinjuku Sky Garden", price: "$6,900,000", location: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    featured: false, aqi: 35, noise: "32dB", investmentGrade: "A+", growthPercentage: 9.1,
    amenities: ["Zen Roof Garden", "Onsen-style Bath", "Smart Home Technology"],
    description: "A modern oasis above the bustling streets of Tokyo. Minimalist design meeting high-technology luxury."
  },
  {
    name: "Belgravia Regency House", price: "$18,000,000", location: "London, UK",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    featured: false, aqi: 48, noise: "42dB", investmentGrade: "A", growthPercentage: 3.5,
    amenities: ["Private Lift", "Underground Parking", "Staff Quarters"],
    description: "A historic regency home completely renovated for modern luxury. Located in London's most prestigious neighborhood."
  },
  {
    name: "Amalfi Cliffside Estate", price: "$11,200,000", location: "Positano, Italy",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    featured: false, aqi: 25, noise: "28dB", investmentGrade: "B+", growthPercentage: 5.8,
    amenities: ["Private Boat Dock", "Lemon Grove Garden", "Panoramic Terrace"],
    description: "Stunning views of the Tyrrhenian Sea from every level. Classic Italian coastal elegance at its finest."
  },
  {
    name: "Modernist Desert Retreat", price: "$7,500,000", location: "Palm Springs, USA",
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    featured: false, aqi: 22, noise: "20dB", investmentGrade: "A", growthPercentage: 7.2,
    amenities: ["Infinity Pool", "Outdoor Kitchen", "Fire Pit Lounge"],
    description: "A mid-century modern inspired home with glass walls that blend into the desert landscape."
  },
  {
    name: "Santorini Horizon Villa", price: "$4,200,000", location: "Oia, Greece",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    featured: false, aqi: 18, noise: "22dB", investmentGrade: "B", growthPercentage: 4.8,
    amenities: ["Infinity Pool", "Sunset Terrace", "Traditional Windmill"],
    description: "Iconic blue and white architecture with unobstructed views of the caldera and the Aegean Sea."
  },
  {
    name: "Sydney Harbour Penthouse", price: "$21,000,000", location: "Sydney, Australia",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    featured: true, aqi: 30, noise: "35dB", investmentGrade: "A++", growthPercentage: 11.5,
    amenities: ["Opera House View", "Floor-to-ceiling Windows", "Private Spa"],
    description: "The ultimate Australian residence with panoramic views of the Opera House and Harbour Bridge."
  },
  {
    name: "Singapore Jungle Oasis", price: "$9,500,000", location: "Singapore",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    featured: false, aqi: 52, noise: "45dB", investmentGrade: "A+", growthPercentage: 6.2,
    amenities: ["Vertical Garden", "Smart Irrigation", "Indoor Waterfall"],
    description: "A bioclimatic home that integrates nature into luxury living in the middle of Singapore's urban heart."
  },
  {
    name: "Barcelona Modernist Loft", price: "$3,800,000", location: "Barcelona, Spain",
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    featured: false, aqi: 40, noise: "38dB", investmentGrade: "A", growthPercentage: 3.9,
    amenities: ["Catalan Vault Ceilings", "Rooftop Terrace", "Designer Lighting"],
    description: "Chic industrial loft in the Eixample district with high ceilings and wide open living spaces."
  },
  {
    name: "Cote d'Azur Estate", price: "$25,000,000", location: "Cannes, France",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    featured: true, aqi: 28, noise: "30dB", investmentGrade: "A+", growthPercentage: 10.2,
    amenities: ["Helipad", "Tennis Court", "Luxury Guest House"],
    description: "One of the most exclusive estates on the French Riviera, offering total privacy and world-class luxury."
  }
];

const importData = async () => {
  try {
    await Property.deleteMany();
    await User.deleteMany();

    // Create a Default Agent
    const masterAgent = await User.create({
      name: "Luxury Agent Alpha",
      email: "agent@luxestate.com",
      password: "password123",
      role: "agent"
    });

    console.log(`Created Master Agent: ${masterAgent.email}`);

    // Map properties to the agent
    const propertiesWithAgent = sampleProperties.map(p => ({
      ...p,
      agent: masterAgent._id
    }));

    await Property.insertMany(propertiesWithAgent);
    console.log('Data Imported with Agent Association!');
    process.exit();
  } catch (error) {
    console.error(`Error with seed: ${error.message}`);
    process.exit(1);
  }
};

importData();
