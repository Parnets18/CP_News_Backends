const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const addressRoutes = require("./routes/addressRoutes")
const productRoutes = require("./routes/productRoutes")
const orderRoutes = require("./routes/orderRoutes");
const venderUserRoutes = require("./routes/venderUserRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const testimonialRoutes = require("./routes/testimonialsRoutes");
const enquiryRoutes =require("./routes/enquiryRoutes");
const cookieParser = require("cookie-parser")
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:3000",   // Dev frontend
  "http://basavamart.in",    // Live frontend
];

app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


app.use("/uploadImg", express.static(path.join(__dirname, "uploadImg")));
app.use("/BrandImg", express.static(path.join(__dirname, "BrandImg")));
app.use("/CategoryImg", express.static(path.join(__dirname, "CategoryImg")));
app.use(
  "/subCategoryImg",
  express.static(path.join(__dirname, "subCategoryImg"))
);
app.use("/LogoImg", express.static(path.join(__dirname, "LogoImg")));
app.use("/ProductImg", express.static(path.join(__dirname, "ProductImg")));
app.use("/BannerImg", express.static(path.join(__dirname, "BannerImg")));


app.get("/", (req, res) => {
    res.send("Hello, Welcome to the Server!");
  });

app.use("/api/auth", authRoutes);
app.use("/api/vender", venderUserRoutes)
app.use("/api/cart", cartRoutes);
app.use("/api/product", productRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/order',orderRoutes);
app.use('/api/banner',bannerRoutes);
app.use('/api/testimonials',testimonialRoutes);
app.use('/api/enquiry',enquiryRoutes)

  const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
