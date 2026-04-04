import OpenAI from 'openai';
import Property from '../models/Property.js';

let openai;
const getOpenAIClient = () => {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not defined in environment variables');
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

// @desc    Search properties using AI (Placeholder)
// @route   POST /api/properties/search
// @access  Public (or Private depending on choice)
export const searchProperties = async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const aiClient = getOpenAIClient();
    const systemPrompt = `
      You are an AI real estate assistant for LuxeEstate AI. 
      Your task is to analyze user queries and extract search criteria.
      The user is looking for luxury properties.
      Return a JSON object with the following optional fields:
      - location: string (city or country)
      - maxPrice: number
      - minPrice: number
      - featured: boolean
      - aqiMax: number
      - noiseLevel: string ('Serene', 'Quiet', 'Moderate')
      - amenities: string[] (keywords like 'pool', 'gym', 'beach')
      - searchText: string (keywords to match name or description)

      Example query: "Quiet villa in Dubai with a pool under 15 million"
      Response: { "location": "Dubai", "maxPrice": 15000000, "noiseLevel": "Serene", "amenities": ["pool"], "searchText": "villa" }
      Only return the JSON.
    `;

    const completion = await aiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      response_format: { type: "json_object" }
    });

    const criteria = JSON.parse(completion.choices[0].message.content);
    console.log('--- AI SEARCH DEBUG ---');
    console.log('User Query:', query);
    console.log('AI Interpreted Criteria:', criteria);

    const dbQuery = {};

    if (criteria.location) {
      dbQuery.location = { $regex: criteria.location, $options: 'i' };
    }

    if (criteria.featured !== undefined) {
      dbQuery.featured = criteria.featured;
    }

    if (criteria.aqiMax) {
      dbQuery.aqi = { $lte: criteria.aqiMax };
    }

    if (criteria.noiseLevel) {
      dbQuery.noise = criteria.noiseLevel;
    }

    if (criteria.amenities && criteria.amenities.length > 0) {
      dbQuery.amenities = { $all: criteria.amenities.map(a => new RegExp(a, 'i')) };
    }

    if (criteria.searchText) {
      dbQuery.$or = [
        { name: { $regex: criteria.searchText, $options: 'i' } },
        { description: { $regex: criteria.searchText, $options: 'i' } }
      ];
    }

    console.log('Generated MongoDB Query:', JSON.stringify(dbQuery, null, 2));
    
    const properties = await Property.find(dbQuery).populate('agent', 'name email');
    console.log(`[AI Search] Found ${properties.length} results.`);
    console.log('-----------------------');

    res.json(properties);
  } catch (error) {
    console.error('--- OpenAI Search Failed (Falling Back to Regex) ---');
    console.error('Error Details:', error.message);
    
    // Manual Regex Fallback Logic
    try {
      const fallbackQuery = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { amenities: { $regex: query, $options: 'i' } }
        ]
      };
      
      console.log('Fallback MongoDB Query:', JSON.stringify(fallbackQuery, null, 2));
      const fallbackProperties = await Property.find(fallbackQuery);
      
      console.log(`[Fallback Search] Found ${fallbackProperties.length} results.`);
      console.log('---------------------------------------------------');
      
      res.json(fallbackProperties);
    } catch (fallbackError) {
      console.error('Critical: Fallback Search also failed:', fallbackError);
      res.json([]);
    }
  }
};

// @desc    Get all properties (for initial dashboard load)
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).populate('agent', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new property
// @route   POST /api/agent/properties
// @access  Private/Agent
export const createProperty = async (req, res) => {
  try {
    const { 
      name, price, location, image, featured, aqi, noise, 
      investmentGrade, growthPercentage, amenities, description 
    } = req.body;

    const property = new Property({
      name, price, location, image, featured, aqi, noise,
      investmentGrade, growthPercentage, amenities, description,
      agent: req.user._id
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get agent's properties
// @route   GET /api/agent/my-properties
// @access  Private/Agent
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ agent: req.user._id });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update property
// @route   PUT /api/agent/properties/:id
// @access  Private/Agent
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      if (property.agent.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'User not authorized to update this property' });
      }

      property.name = req.body.name || property.name;
      property.price = req.body.price || property.price;
      property.location = req.body.location || property.location;
      property.image = req.body.image || property.image;
      property.featured = req.body.featured !== undefined ? req.body.featured : property.featured;
      property.aqi = req.body.aqi || property.aqi;
      property.noise = req.body.noise || property.noise;
      property.investmentGrade = req.body.investmentGrade || property.investmentGrade;
      property.growthPercentage = req.body.growthPercentage || property.growthPercentage;
      property.amenities = req.body.amenities || property.amenities;
      property.description = req.body.description || property.description;

      const updatedProperty = await property.save();
      res.json(updatedProperty);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/agent/properties/:id
// @access  Private/Agent
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      if (property.agent.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'User not authorized to delete this property' });
      }

      await Property.deleteOne({ _id: req.params.id });
      res.json({ message: 'Property removed' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
