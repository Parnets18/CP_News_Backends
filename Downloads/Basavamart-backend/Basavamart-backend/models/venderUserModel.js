const mongoose = require("mongoose");

const venderSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    role: { type: String, enum: ["vendor"], default: 'vendor' },

    otpExpiration: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("vender", venderSchema);