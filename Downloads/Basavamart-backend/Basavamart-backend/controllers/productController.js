const Product = require("../models/product");
const Brand = require("../models/brands");
const User = require("../models/user");
const Category = require("../models/category");
const SubCategory = require("../models/subCategory");
const Catalog = require("../models/catalog");
const path = require("path");
const XLSX = require("xlsx");
const mongoose = require("mongoose");
// exports.addProduct = async (req, res) => {
//   const uploadedFiles = req.files.map((file) => `/ProductImg/${file.filename}`);
//   try {
//     const product = new Product({
//       productName: req.body.name,
//       productDescription: req.body.productDescription,
//       images: uploadedFiles,
//       brand: req.body.brand,
//       category: req.body.category,
//       subcategory: req.body.subcategory,
//       access: req.body.access,
//       available: req.body.available,
//       video: req.body.video,
//       variants: JSON.parse(req.body.variants), // expects an array of variant objects
//     });

//     await product.save();
//     console.log("product added");
//     res.status(201).json(product);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.addProduct = async (req, res) => {
  const uploadedFiles = req.files.map((file) => `/ProductImg/${file.filename}`);
  try {
    // Check if this is a vendor product
    const vendorId = req.body.vendorId;
    const vendorName = req.body.vendorName;
    
    const product = new Product({
      productName: req.body.name,
      productDescription: req.body.productDescription,
      images: uploadedFiles,
      brand: req.body.brand,
      category: req.body.category,
      subcategory: req.body.subcategory,
      access: req.body.access,
      available: req.body.available,
      video: req.body.video,
      variants: JSON.parse(req.body.variants),
      
      // Add vendor information if provided
      vendorId: vendorId || undefined,
      vendorName: vendorName || undefined,
      status: vendorId ? 'pending' : 'approved', // Admin products are auto-approved
      addedBy: vendorId ? 'vendor' : 'admin'
    });

    await product.save();
    console.log("product added");
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find()
//       .populate("brand")
//       .populate("category")
//       .populate("subcategory");
//     res.json(products);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
exports.getProducts = async (req, res) => {
  try {
    // Build filter based on query parameters
    let filter = {};
    
    // CASE 1: Vendor requesting their own products
    if (req.query.vendorId) {
      filter.vendorId = req.query.vendorId;
      
      // If vendorName also provided, use it for additional filtering
      if (req.query.vendorName) {
        filter.vendorName = req.query.vendorName;
      }
    }
    // CASE 2: Admin requesting vendor products
    else if (req.query.vendorOnly === 'true') {
      // Find products that have a vendorId set (meaning vendor-added)
      filter.vendorId = { $exists: true, $ne: null };
    }
    // CASE 3: Admin requesting admin products
    else if (req.query.adminOnly === 'true') {
      // Find products without vendorId (meaning admin-added)
      filter.vendorId = { $exists: false };
      
      // Also include edge case where vendorId might be null
      const nullVendorIdFilter = { vendorId: null };
      
      // Use $or to combine filters
      filter = { $or: [filter, nullVendorIdFilter] };
    }
    
    console.log("Fetching products with filter:", JSON.stringify(filter));
    
    const products = await Product.find(filter)
      .populate("brand")
      .populate("category")
      .populate("subcategory");
      
    console.log(`Found ${products.length} products matching criteria`);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getUserProduct = async (req, res) => {
  try {
    const filter = {
      access: "User",
    };
    const products = await Product.find(filter)
      .populate("brand")
      .populate("category")
      .populate("subcategory");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { role } = req.user;
    const accessFilter =
      role === "member"
        ? ["user", "member"]
        : role === "specialmember"
        ? []
        : ["user"]; // Default to "user" access
    const filter = {
      ...(accessFilter.length > 0
        ? {
            access: { $in: accessFilter.map((r) => new RegExp(`^${r}$`, "i")) },
          }
        : {}),
    };

    const products = await Product.find(filter)
      .populate("brand", "name")
      .populate("category", "name")
      .populate("subcategory", "name");

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.getuserProductByBrand = async (req, res) => {
  try {
    const { brand, category, subcategory } = req.query;
    const filter = { access: "User" };

    // Check if the brand is provided and is valid
    if (brand) {
      const brandObj = await Brand.findOne({ name: brand });
      if (brandObj) {
        filter.brand = brandObj._id;
      } else {
        return res.status(404).json({ error: "Brand not found" });
      }
    }

    // Apply category filter
    if (category) {
      const categoryObj = await Category.findOne({ name: category });
      if (categoryObj) {
        filter.category = categoryObj._id;
      } else {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    // Apply subcategory filter
    if (subcategory) {
      const subCategoryObj = await SubCategory.findOne({ name: subcategory });
      if (subCategoryObj) {
        filter.subcategory = subCategoryObj._id;
      } else {
        return res.status(404).json({ error: "Subcategory not found" });
      }
    }

    // Fetch products based on the filter
    const products = await Product.find(filter)
      .populate("brand", "name")
      .populate("category", "name")
      .populate("subcategory", "name");

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for the specified filters" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.getProductByBrand = async (req, res) => {
  try {
    const { brand, category, subcategory } = req.query;
    const UserId = req.user.id;
    const user = await User.findById(UserId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { role } = user;
    let accessFilter = []; // Default value for specialmember or undefined roles

    // Define access based on role
    if (role) {
      if (role.toLowerCase() === "user") {
        accessFilter = ["user"];
      } else if (role.toLowerCase() === "member") {
        accessFilter = ["user", "member"];
      }
    }

    // Base filter
    const filter = {};

    // Apply access filter
    if (accessFilter && accessFilter.length > 0) {
      filter.access = {
        $in: accessFilter.map((r) => new RegExp(`^${r}$`, "i")),
      };
    }

    // Apply brand filter
    if (brand) {
      const brandObj = await Brand.findOne({ name: brand });
      if (brandObj) {
        filter.brand = brandObj._id;
      } else {
        return res.status(404).json({ error: "Brand not found" });
      }
    }

    // Apply category filter
    if (category) {
      const categoryObj = await Category.findOne({ name: category });
      if (categoryObj) {
        filter.category = categoryObj._id;
      } else {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    // Apply subcategory filter
    if (subcategory) {
      const subCategoryObj = await SubCategory.findOne({ name: subcategory });
      if (subCategoryObj) {
        filter.subcategory = subCategoryObj._id;
      } else {
        return res.status(404).json({ error: "Subcategory not found" });
      }
    }

    // Fetch products with filters
    const products = await Product.find(filter)
      .populate("brand", "name")
      .populate("category", "name")
      .populate("subcategory", "name");

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand", "name")
      .populate("category", "name")
      .populate("subcategory", "name");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      res.json(product);
    }
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getBrand = async (req, res) => {
  try {
    const brand = await Brand.find();
    res.json(brand);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.find();
    res.json(category);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.find().populate("category");
    res.json(subCategory);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getProductByName = async (req, res) => {
  try {
    const product = await Product.find({ name: req.params.name });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getProductsBybrcat = async (req, res) => {
  try {
    const { brandSearch, categorySearch } = req.query;
    console.log(brandSearch, categorySearch);

    // Build a dynamic query object
    let query = {};

    if (brandSearch) {
      query["brand.name"] = brandSearch; // Match the brand name
    }

    if (categorySearch) {
      query["category.name"] = categorySearch; // Match the category name
    }

    const products = await Product.find(query)
      .populate("brand")
      .populate("category")
      .populate("subcategory");

    res.status(201).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getProductsByBrand = async (req, res) => {
  try {
    const { brand, category, subcategory } = req.params;
    const { role } = req.user; // Extract user role from req.user
    const products = await Product.find({
      brand,
      category,
      subcategory,
    })
      .populate("brand")
      .populate("category")
      .populate("subcategory");

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Filter products based on user role and access
    let filteredProducts = [];
    if (role === "specialMember") {
      // Special member: Send all products
      filteredProducts = products;
    } else if (role === "member") {
      // Member: Send products with access 'user' or 'member'
      filteredProducts = products.filter(
        (product) => product.access === "User" || product.access === "Member"
      );
    } else {
      // User or any other role: Send products with access 'user'
      filteredProducts = products.filter(
        (product) => product.access === "User"
      );
    }

    // Return the filtered products
    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getProductByRoles = async (req, res) => {
  try {
    const { role } = req.user;
    let products = await Product.find()
      .populate("brand")
      .populate("category")
      .populate("subcategory");
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    let filteredProducts = [];
    if (role === "specialMember") {
      filteredProducts = products;
    } else if (role === "member") {
      filteredProducts = products.filter(
        (product) => product.access === "User" || product.access === "Member"
      );
    } else {
      filteredProducts = products.filter(
        (product) => product.access === "User"
      );
    }
    // Return the filtered products
    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { product, variant } = req.body;

  try {
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    Object.assign(existingProduct, product);

    const variantIndex = existingProduct.variants.findIndex(
      (v) => v._id.toString() === variant._id
    );

    if (variantIndex === -1) {
      return res.status(404).json({ message: "Variant not found" });
    }

    existingProduct.variants[variantIndex] = {
      ...existingProduct.variants[variantIndex]._doc,
      ...variant,
    };

    const updatedProduct = await existingProduct.save();
    res.status(201).json({
      message: "Product and variant updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        img: req.file ? `/CategoryImg/${req.file.filename}` : "",
      },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
// Make sure updateProductStatus is exported with the other functions
exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    product.status = status;
    await product.save();
    
    res.status(200).json({
      message: `Product ${status} successfully`,
      product
    });
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const subCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        img: req.file ? `/subCategoryImg/${req.file.filename}` : "",
      },
      { new: true }
    );
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.json(subCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    // console.log(productId, variantId);

    // Use $pull to remove the variant from the product's variants array
    const result = await Product.findByIdAndUpdate(
      productId,
      { $pull: { variants: { _id: variantId } } },
      { new: true } // Return the updated document
    );

    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(201)
      .json({ message: "Variant deleted successfully", product: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "Subcategory deleted successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand already exists" });
    }
    const brand = new Brand({
      name,
      img: req.file ? `/BrandImg/${req.file.filename}` : "",
    });
    await brand.save();
    console.log("brand added");
    res.json(brand);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// exports.addCategory = async (req, res) => {
//   try {
//     const { name, subcat } = req.body;
//     const existingCategory = await Category.findOne({ name });
//     if (existingCategory) {
//       return res.status(400).json({ message: "Category already exists" });
//     }
//     const category = new Category({
//       name,
//       subcat,
//       img: req.file ? `/CategoryImg/${req.file.filename}` : "",
//     });
//     await category.save();
//     res.json(category);
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// };


exports.addCategory = async (req, res) => {
  try {
    const { name, brand } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    
    if (!brand) {
      return res.status(400).json({ message: "Brand reference is required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    
    const category = new Category({
      name,
      brand, // Correctly use the brand from the request
      img: req.file ? `/CategoryImg/${req.file.filename}` : "",
    });
    
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.addSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const existingSubCategory = await SubCategory.findOne({ name });
    if (existingSubCategory) {
      return res.status(400).json({ message: "Subcategory already exists" });
    }
    const subCategory = new SubCategory({
      name,
      category,
      img: req.file ? `/subCategoryImg/${req.file.filename}` : "",
    });
    await subCategory.save();
    res.status(200).json(subCategory);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, img: req.file ? `/BrandImg/${req.file.filename}` : "" },
      { new: true }
    );
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    console.log("brand updated");
    res.json(brand);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: "Brand deleted successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    const { id } = req.params; // Product ID
    const file = req.file; // Uploaded file

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/${file.filename}`;

    // Check if a catalog entry already exists for the product
    let catalog = await Catalog.findOne({ productId: id });

    if (catalog) {
      // If a catalog exists, update it with the new file path
      catalog.file = filePath;
      await catalog.save();
      return res
        .status(200)
        .json({ message: "File updated successfully", catalog });
    } else {
      // If no catalog exists, create a new catalog entry
      catalog = new Catalog({
        productId: id,
        file: filePath,
      });
      await catalog.save();
      return res
        .status(200)
        .json({ message: "File uploaded successfully", catalog });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.downloadFile = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("Looking for catalog with productId:", id);
    const catalog = await Catalog.findOne({ productId: id });

    if (!catalog) {
      console.log("No catalog found for productId:", id);
      return res.status(404).send("Catalog not found for this product. Please upload a catalog first.");
    }

    console.log("Found catalog:", catalog);
    
    // Extract the file path
    const filePath = path.join(
      __dirname,
      "../uploads",
      catalog.file.replace("/uploads/", "")
    );
    
    console.log("Resolved file path:", filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error("File not found at path:", filePath);
      return res.status(404).send("Catalog file not found on server");
    }

    // Serve the file
    res.download(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error downloading file");
      }
    });
  } catch (error) {
    console.error("Error fetching catalog:", error);
    res.status(500).send("Server error");
  }
};
const calculateDiscountAmount = (listPrice, discount) => {
  const listPriceValue = parseFloat(listPrice) || 0;
  const discountPercentage = parseFloat(discount) || 0;
  return listPriceValue * (discountPercentage / 100);
};

const calculateAfterDiscountPrice = (listPrice, discountAmount) => {
  const listPriceValue = parseFloat(listPrice) || 0;
  return listPriceValue - discountAmount;
};

const calculateProfitMargin = (afterDiscountPrice, profit) => {
  const profitPercentage = parseFloat(profit) || 0;
  return afterDiscountPrice * (profitPercentage / 100);
};

const calculateLandingPrice = (afterDiscountPrice, profitMargin) => {
  return afterDiscountPrice + profitMargin;
};

const calculateTaxAmount = (landingPrice, tax) => {
  const taxPercentage = parseFloat(tax) || 0;
  return landingPrice * (taxPercentage / 100);
};

const calculateFinalPrice = (landingPrice, taxAmount) => {
  return landingPrice + taxAmount;
};

exports.uploadVariant = async (req, res) => {
  try {
    const filePath = req.file.path;

    // Read and parse Excel file
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    for (const row of rows) {
      const {
        productId,
        listPrice,
        discount,
        qty,
        weight,
        profit,
        tax,
        ...otherData
      } = row;

      // Perform calculations
      const totalWeight = weight * qty;
      const discountAmount = calculateDiscountAmount(listPrice, discount);
      const afterDiscountPrice = calculateAfterDiscountPrice(
        listPrice,
        discountAmount
      );
      const profitMargin = calculateProfitMargin(afterDiscountPrice, profit);
      const landingPrice = calculateLandingPrice(
        afterDiscountPrice,
        profitMargin
      );
      const taxAmount = calculateTaxAmount(landingPrice, tax);
      const finalPrice = calculateFinalPrice(landingPrice, taxAmount);

      // Add calculated values to variant
      const variant = {
        ...otherData,
        qty,
        weight,
        totalWeight,
        listPrice,
        discount,
        profit,
        tax,
        discountAmt: discountAmount,
        afterdiscountPrice: afterDiscountPrice,
        profitMargin,
        landingPrice,
        taxAmt: taxAmount,
        finalPrice,
      };

      // Update product in database
      const product = await Product.findById(productId);
      if (product) {
        product.variants.push(variant);
        await product.save();
      }
    }
    console.log("uploaded");
    res.status(200).send({ message: "Variants uploaded successfully." });
  } catch (error) {
    console.error("Error uploading variants:", error);
    res.status(500).send({ message: "Error uploading variants." });
  }
};

exports.downloadTemplate = async (req, res) => {
  const columns = [
    "productId",
    "name",
    "description",
    "hsn",
    "qty",
    "unitOfMeasurement",
    "weight",
    "stock",
    "listPrice",
    "discount",
    "profit",
    "tax",
  ];

  // Prepare workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheetData = [columns]; // First row as headers
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

  // Write the workbook to a buffer and send it
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=variant_template.xlsx"
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.send(buffer);
};
