const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: { type: String,  },
    lastname: { type: String,  },
    email: { type: String, required: true, unique: true },
    companyName:{type:String},
    logo:{type:String},
    phone:{type:String},
    gst:{type:String},
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin','member','specialMember',"vendor"], default: 'user' },
    isVerified: { type: Boolean, default: false }, 
    otp: { type: String },
    otpExpiration: { type: Date },
    createdAt:{type:Date , default:Date.now},
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);