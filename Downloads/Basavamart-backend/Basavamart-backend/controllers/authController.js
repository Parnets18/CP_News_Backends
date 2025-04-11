const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { setTokenInCookie } = require('../utils/handleToken');
const sendEmail = require("../utils/emailService");
const generateOTP = require("../utils/generateOTP");
const path = require("path");
const fs = require("fs");
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    const user = await User.findOne({ email });
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Skip verification check for admin users
    if (!user.isVerified && user.role !== 'admin') {
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiration = Date.now() + 10 * 60 * 1000;
      await user.save();
      
      await sendEmail(email, "Your OTP Code", `Your OTP code is: ${otp}. This code will expire in 10 minutes.`);
      
      return res.status(401).json({ 
        message: "Please verify your email first. A new OTP has been sent to your email.",
        requiresVerification: true,
        email: email
      });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    console.log("Password match:", isPassword);

    if (!isPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    setTokenInCookie(res, token);
    console.log("Login successful, token generated");

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.firstname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Signup User
exports.signup = async (req, res) => {
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
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP
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

    // Detailed logging for debugging
    console.log("Verification attempt for:", email);
    console.log("Stored OTP:", user.otp);
    console.log("Received OTP:", otp);
    console.log("OTP Expiration:", user.otpExpiration);
    console.log("Current time:", new Date());

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Check if the OTP exists
    if (!user.otp) {
      return res.status(400).json({ 
        message: "OTP not found or already used. Please request a new one." 
      });
    }

    // Check if the OTP has expired
    if (Date.now() > user.otpExpiration) {
      // Clear expired OTP
      user.otp = undefined;
      user.otpExpiration = undefined;
      await user.save();
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Compare the OTP (trim any whitespace)
    if (user.otp.trim() !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    // Set cookie and send response
    setTokenInCookie(res, token);
    
    return res.status(200).json({
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.firstname,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Error during OTP verification:", error);
    return res.status(500).json({ message: "Server error during verification" });
  }
};

// Get Users
// exports.getUser = async (req, res) => {
//   try {
//     const role = req.query.role;
//     const users = await User.find(role ? { role } : {});
//     res.status(200).json(users);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ message: "User Not Found" });
//   }
// };

// In getUser controller
exports.getUser = async (req, res) => {
  try {
    const role = req.query.role;
    const users = await User.find(role ? { role } : {});
    
    // Log complete user data for debugging
    console.log(`getUser with role=${role}, found ${users.length} users`);
    if (users.length > 0) {
      console.log("Sample user data:", JSON.stringify({
        _id: users[0]._id,
        firstname: users[0].firstname,
        lastname: users[0].lastname,
        companyName: users[0].companyName,
        logo: users[0].logo,
        phone: users[0].phone,
        gst: users[0].gst
      }, null, 2));
    }
    
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "User Not Found" });
  }
};

// Add User (Admin Only)
// exports.addUser = async (req, res) => {
//   try {
//     const { firstname, lastname, email, password, role } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         message:
//           "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);
//     const isAdmin = role === 'admin';

//     const user = new User({
//       firstname,
//       lastname,
//       email,
//       password: hashedPassword,
//       role,
//       isVerified: isAdmin, // Automatically verify admin users
//     });
    
//     await user.save();

//     // If admin, generate token and login immediately
//     if (isAdmin) {
//       const token = jwt.sign(
//         { id: user._id, role: user.role },
//         process.env.JWT_SECRET,
//         { expiresIn: "3h" }
//       );

//       setTokenInCookie(res, token);
      
//       return res.status(201).json({
//         message: "Admin user created successfully",
//         token,
//         user: {
//           id: user._id,
//           name: user.firstname,
//           email: user.email,
//           role: user.role,
//           isVerified: true
//         }
//       });
//     }

//     // For non-admin users, continue with OTP process
//     const otp = generateOTP();
//     user.otp = otp;
//     user.otpExpiration = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     await sendEmail(email, "Your OTP Code", `Your OTP code is: ${otp}. This code will expire in 10 minutes.`);
//     res.status(201).json({ message: "User registered, OTP sent to email" });

//   } catch (error) {
//     console.error("Error adding user:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.addUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role, companyName, phone, gst } = req.body;

    console.log("Add user request:", {
      body: {
        firstname, lastname, email, role, companyName, phone, gst
      },
      file: req.file ? req.file.filename : "No file uploaded"
    });

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate password
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const isAdmin = role === 'admin';

    // Handle logo file if uploaded
    const logo = req.file ? `/LogoImg/${req.file.filename}` : null;
    
    // Create user with all fields
    const user = new User({
      firstname,
      lastname,
      email,
      companyName,
      logo,
      phone,
      gst,
      password: hashedPassword,
      role,
      isVerified: isAdmin, // Automatically verify admin users
    });
    
    await user.save();
    console.log("User saved successfully:", user._id);

    // If admin, generate token and login immediately
    if (isAdmin) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      setTokenInCookie(res, token);
      
      return res.status(201).json({
        message: "Admin user created successfully",
        token,
        user: {
          id: user._id,
          name: user.firstname,
          email: user.email,
          role: user.role,
          isVerified: true
        }
      });
    }

    // For non-admin users, continue with OTP process
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiration = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(email, "Your OTP Code", `Your OTP code is: ${otp}. This code will expire in 10 minutes.`);
    res.status(201).json({ message: "User registered, OTP sent to email" });

  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Error adding user", error: error.message });
  }
};

// Update User (Admin Only)
// exports.updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { password, ...otherFields } = req.body;

//     if (password) {
//       if (!passwordRegex.test(password)) {
//         return res.status(400).json({
//           message:
//             "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.",
//         });
//       }
//       const hashedPassword = await bcrypt.hash(password, 12);
//       otherFields.password = hashedPassword;
//     }

//     const updatedUser = await User.findByIdAndUpdate(id, otherFields, {
//       new: true,
//     });

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(updatedUser);
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, firstname, lastname, email, companyName, phone, gst, role } = req.body;

    console.log("Update user request:", {
      id,
      body: { firstname, lastname, email, companyName, phone, gst, role },
      file: req.file ? req.file.filename : "No file updated"
    });

    // Prepare update fields
    const updateFields = {
      firstname,
      lastname,
      email,
      companyName,
      phone,
      gst,
      role
    };

    // Handle password update
    if (password) {
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message: "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.",
        });
      }
      updateFields.password = await bcrypt.hash(password, 12);
    }

    // Handle logo update
    if (req.file) {
      updateFields.logo = `/LogoImg/${req.file.filename}`;
      console.log("Updating logo to:", updateFields.logo);
      
      // Optionally delete old logo file
      const existingUser = await User.findById(id);
      if (existingUser && existingUser.logo) {
        const oldLogoPath = path.join(__dirname, '..', existingUser.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
          console.log("Deleted old logo:", oldLogoPath);
        }
      }
    }

    // Remove any undefined fields
    Object.keys(updateFields).forEach(key => 
      updateFields[key] === undefined && delete updateFields[key]
    );

    console.log("Final update fields:", updateFields);

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User updated successfully:", updatedUser._id);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};
// Delete User (Admin Only)
exports.deleteUser = async (req, res) => {
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
exports.userUpdate = async (req, res) => {
  try {
    const { id } = req.user;
    const { password, ...otherFields } = req.body;
    
    console.log("User ID:", id);
    console.log("Update request:", req.body);
    console.log("Fields to update:", otherFields);

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
exports.userDelete = async (req, res) => {
  try {
    const { id } = req.user;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Account Deleted" });
  } catch (error) {
    console.error("Error deleting user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};