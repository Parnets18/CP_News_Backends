const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  weight: { type: Number },
  qty: { type: Number },
  unitOfMeasurement: { type: String },
  hsn: { type: String },
  stock: { type: Number },
  listPrice: { type: Number },
  discount: { type: Number },
  discountAmt: { type: Number },
  totalWeight: { type: Number },
  afterdiscountPrice: { type: Number },
  profit: { type: Number },
  profitMargin: { type: Number },
  landingPrice: { type: Number },
  tax: { type: Number },
  taxAmt: { type: Number },
  finalPrice: { type: Number },
});

const productSchema = new mongoose.Schema({
  productName: { type: String },
  productDescription: { type: String },
  access: { type: String },
  images: [{ type: String, required: true }],
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    // required: true,
  },
  available: { type: String },
  video: { type: String },
  variants: [variantSchema], // Add variants array
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vender" },
  vendorName: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  addedBy: { type: String, enum: ['admin', 'vendor'], default: 'admin' }
});

productSchema.methods.addVariant = function (variant) {
  this.variants.push(variant);
  return this.save();
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
