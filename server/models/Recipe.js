import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  ingredients: [{ type: String }],
  price: { type: Number, required: true },
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Recipe', recipeSchema);
