const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  price: { type: Number },
  address: { 
    firstName:{type:String},
    lastName:{type:String},
    addressLine1:{type:String},
    addressLine2:{type:String},
    city:{type:String},
    country:{type:String},
    state:{type:String},
    zipCode:{type:Number},
   },
  type: { type: String },
  paymentTerm:{type:String},
  status: { type: String, default: "Pending" },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      productName: { type: String, required: true },
      productImg: { type: String },
      variant: {
        hsn: { type: String, required: true },
        name :{type:String},
        size: { type: String },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        tax:{type : Number}
      },
      totalPrice: { type: Number, required: true },
    },
  ],
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
