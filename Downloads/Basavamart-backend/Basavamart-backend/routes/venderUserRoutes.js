const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { venderUserSignup, verifyOTP,requestOTP, venderUserLogin, getVenderUser, addVenderUser, updateVenderUser, venderUserUpdate, deleteVenderUser, venderUserdelete } = require("../controllers/venderUserController.js");
const router = express.Router();

router.post("/venderUserSignup", venderUserSignup);
router.post("/verify-otp", verifyOTP);
// router.post("/request-otp",requestOTP);
router.post("/request-otp", requestOTP);
router.post('/venderUserLogin',venderUserLogin);
router.get("/getVenderUser",getVenderUser);
router.post("/addVenderUser",addVenderUser);
router.put("/updateVenderUser/:id",updateVenderUser);
router.put("/venderUserUpdate",protect,venderUserUpdate);
router.delete('/deleteVenderUser/:id',deleteVenderUser)
router.delete('/venderUserdelete',protect,venderUserdelete)

module.exports = router;
