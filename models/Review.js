import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    stars: { type: Number, min: 1, max: 5, index: true },
    isChanged: { type: Boolean, enum: [false, true], default: false }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Review', ReviewSchema)