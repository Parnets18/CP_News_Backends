// const express = require("express");
// const {
//   login,
//   getUser,
//   updateUser,
//   addUser,
//   deleteUser,
//   userUpdate,
//   userDelete,
//   signup,
//   verifyOTP
// } = require("../controllers/authController");
// const { protect } = require("../middleware/authMiddleware");
// const router = express.Router();

// router.post("/signup", signup);
// router.post("/verify-otp", verifyOTP);
// // router.post("/request-otp",requestOTP);
// router.post('/login',login);
// router.get("/getuser",getUser);
// router.post("/adduser",addUser);
// router.put("/updateuser/:id",updateUser);
// router.put("/userupdate", protect, userUpdate);
// router.delete('/deleteuser/:id',deleteUser)
// router.delete('/userdelete', protect, userDelete)

// module.exports = router;


const express = require("express");
const {
  login,
  getUser,
  updateUser,
  addUser,
  deleteUser,
  userUpdate,
  userDelete,
  signup,
  verifyOTP
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const logoImg = require("../middleware/logoImgUpload");
const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post('/login', login);
router.get("/getuser", getUser);
router.post("/adduser", logoImg.single("logo"), addUser);
router.put("/updateuser/:id", logoImg.single("logo"), updateUser);
router.put("/userupdate", protect, logoImg.single("logo"), userUpdate);
router.delete('/deleteuser/:id', deleteUser);
router.delete('/userdelete', protect, userDelete);

module.exports = router;
