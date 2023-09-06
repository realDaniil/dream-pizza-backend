import mongoose from 'mongoose';

const SavedTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('SavedType', SavedTypeSchema)