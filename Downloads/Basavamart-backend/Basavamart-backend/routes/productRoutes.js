const express = require("express");
const {
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  addBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  getProductById,
  getProductByBrand,
  getProducts,
  uploadFile,
  downloadFile,
  getUserProduct,
  getuserProductByBrand,
  addSubCategory,
  updateSubCategory,
  getSubCategory,
  deleteSubCategory,
  getProductByName,
  getProductsBybrcat,
  uploadVariant,
  downloadTemplate,
  getProductsByBrand,
  getProductByRoles,
  updateProductStatus
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const {protect1} = require("../middleware/authMiddleware");
const cors = require("cors");

const brandImg = require("../middleware/brandImgUpload")
const categoryImg = require("../middleware/categoryImgUpload")
const subCategoryImg = require("../middleware/subCategoryImgUpload")
const productImg = require("../middleware/productImgUpload")

const router = express.Router();

router.post("/addproduct", productImg.array("images"), addProduct);
router.get("/getproducts", getProducts);
router.get("/getUserProduct", getUserProduct);
router.get("/getproduct", protect1, getProduct);
router.get("/getUserProductByBrand", getuserProductByBrand);
router.get("/getproduct/:id", getProductById);
router.get("/getproductbybrand", protect, getProductByBrand);
router.get("/getproductsbybrcat", protect, getProductsBybrcat);
router.get("/getbrand", getBrand);
router.get("/getcategory", getCategory);
router.get("/getsubcategory", getSubCategory);
router.put("/updateproduct/:id", updateProduct);
router.put("/getProductByName/:name", getProductByName);
router.delete("/deleteproduct/:productId/variant/:variantId",cors(), deleteProduct);
router.delete("/deletecategory/:id", deleteCategory);
router.delete("/deletesubcategory/:id", deleteSubCategory);
router.delete("/deletebrand/:id", deleteBrand);
router.post("/addbrand",brandImg.single('img'), addBrand);
router.post("/addcategory",categoryImg.single('img'), addCategory);
router.post("/addsubcategory",subCategoryImg.single('img'), addSubCategory);
router.put("/updatebrand/:id",brandImg.single('img'), updateBrand);
router.put("/updatecategory/:id",categoryImg.single('img'), updateCategory);
router.put("/updatesubcategory/:id",subCategoryImg.single('img'), updateSubCategory);
// Add this new route to your routes file
// In product routes file
// router.put("/updateStatus/:id", updateProductStatus);
// In your product routes file
router.put("/updateStatus/:id", protect1,updateProductStatus);
//react native routes
router.get("/getproductbybrand/:brand/:category/:subcategory",protect1,getProductsByBrand);
router.get("/getproductbyroles",protect1,getProductByRoles);

const upload = require("../middleware/fileUpload");

router.post("/upload/:id", upload.single("file"), uploadFile);
router.get("/download/:id", downloadFile);

const variantsUpload = require("../middleware/variantUpload");
router.post("/upload-variants",variantsUpload.single("file"),uploadVariant)
router.get("/download-template",downloadTemplate)

module.exports = router;