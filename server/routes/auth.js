// routes/auth.js - FIXED VERSION
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const email = req.body.email;
        const extension = path.extname(file.originalname);
        cb(null, email + '_profile' + extension);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only JPG and PNG files are allowed'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Password validation function
const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
};

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// REGISTER - FIXED
router.post('/register', upload.single('profileImage'), async (req, res) => {
    const { name, email, password, companyName, age, dateOfBirth } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email!" });
        }

        // Validate password
        if (!validatePassword(password)) {
            return res.status(400).json({ 
                message: "Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters" 
            });
        }

        // Check if image was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Profile image is required" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            companyName,
            age: parseInt(age),
            dateOfBirth: new Date(dateOfBirth),
            profileImage: req.file.filename
        });

        const savedUser = await newUser.save();
        
        // Generate JWT token for registered user
        const payLoad = {
            id: savedUser._id,
            email: savedUser.email,
        };

        const accessToken = jwt.sign(
            payLoad,
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );

        const { password: _, ...userData } = savedUser._doc;
        
        // Return user data with token (no OTP needed for registration)
        res.status(201).json({
            ...userData,
            accessToken,
            message: "Registration successful"
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message || "Registration failed" });
    }
});

// LOGIN - FIXED
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Sorry, we can't log you in." });
        }

        // Compare password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Sorry, we can't log you in." });
        }

        // Generate OTP
        const otpCode = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Update user with OTP
        await User.findByIdAndUpdate(user._id, {
            'otp.code': otpCode,
            'otp.expiresAt': otpExpiry
        });

        const { password: _, ...userData } = user._doc;
        
        // Return user data WITHOUT token and WITH OTP (for development)
        // In production, send OTP via email/SMS instead of returning it
        res.status(200).json({ 
            email: userData.email,
            name: userData.name,
            requiresOTP: true,
            otp: otpCode, // Remove this in production
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Sorry, we can't log you in." });
    }
});

// VERIFY OTP - FIXED
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if OTP is valid and not expired
        if (user.otp.code !== otp || new Date() > user.otp.expiresAt) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Clear OTP after successful verification
        await User.findByIdAndUpdate(user._id, {
            'otp.code': null,
            'otp.expiresAt': null
        });

        // Generate JWT token after successful OTP verification
        const payLoad = {
            id: user._id,
            email: user.email,
        };

        const accessToken = jwt.sign(
            payLoad,
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );

        const { password: _, otp: __, ...userData } = user._doc;
        
        res.status(200).json({ 
            ...userData,
            accessToken,
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: "OTP verification failed" });
    }
});

module.exports = router;