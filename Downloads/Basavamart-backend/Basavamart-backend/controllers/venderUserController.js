const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { setTokenInCookie } = require('../utils/handleToken');
const sendEmail = require("../utils/emailService");
const generateOTP = require("../utils/generateOTP");

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

// venderUserLogin User
exports.venderUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    setTokenInCookie(res, token);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.firstname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("venderUserLogin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// venderUserSignup User
exports.venderUserSignup = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      otp, // Ensure this is being saved
      otpExpiration: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
    });
    await newUser.save();

    console.log("Generated OTP:", otp); // Log the generated OTP
    console.log("User saved:", newUser); // Log the saved user

    await sendEmail(email, "Your OTP Code", `Your OTP code is: ${otp}. This code will expire in 10 minutes.`);
    res.status(201).json({ message: "User registered, OTP sent to email" });
  } catch (error) {
    console.error("Error during venderUserSignup:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP

exports.requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
    console.log("fwgregre ",otp)
    await user.save();
    
    await sendEmail(email, "Your OTP Code", `Your OTP code is: ${otp}. This code will expire in 10 minutes.`);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log the stored OTP and received OTP for debugging
    console.log("Stored OTP:", user.otp);
    console.log("Received OTP:", otp);

    // Check if the OTP is undefined
    if (!user.otp) {
      return res.status(400).json({ message: "OTP not found. Please request a new one." });
    }

    // Check if the OTP has expired
    if (Date.now() > user.otpExpiration) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Compare the OTP (trim any extra spaces)
    if (user.otp.trim() !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear the OTP and its expiration time after successful verification
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: "vendor" }, process.env.JWT_SECRET, { expiresIn: "3h" });

    // Set the token in a cookie
    setTokenInCookie(res, token);

    // Send a success response
    res.status(200).json({ message: "OTP verified successfully", user });
  } catch (error) {
    console.error("Error during OTP verification:", error);

    // Handle different types of errors
    if (error.response) {
      res.status(error.response.status).json({ message: error.response.data.message || "An error occurred. Please try again later." });
    } else if (error.request) {
      res.status(500).json({ message: "No response from the server. Please check your network connection." });
    } else {
      res.status(500).json({ message: "An unexpected error occurred. Please try again." });
    }
  }
};

// Get Users
exports.getVenderUser = async (req, res) => {
  try {
    const role = req.query.role;
    const users = await User.find(role ? { role } : {});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add User (Admin Only)
exports.addVenderUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
    });
    await user.save();

    console.log("User added:", user);
    res.status(201).json(user);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update User (Admin Only)
exports.updateVenderUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...otherFields } = req.body;

    if (password) {
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      otherFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, otherFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete User (Admin Only)
exports.deleteVenderUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update User Profile (Self)
exports.venderUserUpdate = async (req, res) => {
  try {
    const { id } = req.user;
    const { password, ...otherFields } = req.body;

    if (password) {
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      otherFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, otherFields, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete User Profile (Self)
exports.venderUserdelete = async (req, res) => {
  try {
    const { id } = req.user;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Account Deleted" });
  } catch (error) {
    console.error("Error deleting user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};