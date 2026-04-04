import mongoose from 'mongoose';

const propertySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
    aqi: { type: Number, required: true },
    noise: { type: String, required: true },
    investmentGrade: { type: String, default: 'A' },
    growthPercentage: { type: Number, default: 0 },
    amenities: [{ type: String }],
    description: { type: String },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model('Property', propertySchema);

export default Property;
