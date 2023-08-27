import mongoose from 'mongoose';

const SavedProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    ingredients: { type: Array },
    prices: [
      {
        size: { type: String, enum: ['small', 'medium', 'large', 'any'], required: true },
        price: { type: Number, required: true }
      }
    ],
    imageUrl: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('SavedProduct', SavedProductSchema)
