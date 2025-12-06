const { Router } = require('express');
const router = Router();
const z = require('zod');
const User = require('../../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const googleClient = require('../../config/googleConfig');
const authMiddleware = require('../../middleware/authMiddleware');

router.post('/register', async (req, res) => {
    const requiredDataSchema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        role: z.enum(["farmer", "company"]),
    });
    try {

        const validation = requiredDataSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ msg: "something went wrong", errors: validation.error.errors });
        }

        const { name, email, password, role } = validation.data;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User with this email already exists", existingUser: existingUser._id, UserRole: existingUser.role, status: existingUser.status, createdAt: existingUser.createdAt, updated: existingUser.updatedAt });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            passwordHash: hashedPassword,
            role,
        });
        await newUser.save();
        res.status(201).json({ msg: "User registered successfully", existingUser: newUser._id, UserRole: newUser.role, status: newUser.status, createdAt: newUser.createdAt, updated: newUser.updatedAt });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", error: error.message });

    }
});

router.post('/google', async (req, res) => {
    const { tokenId, role } = req.body;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub, email, name } = payload;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json({ msg: "User already registered", existingUser: existingUser._id, UserRole: existingUser.role, status: existingUser.status, createdAt: existingUser.createdAt, updated: existingUser.updatedAt });
        }
        const newUser = new User({
            name,
            email,
            googleId: sub,
            role,
        });
        await newUser.save();

        res.status(200).json({ msg: "User registered successfully", existingUser: newUser._id, UserRole: newUser.role, status: newUser.status, createdAt: newUser.createdAt, updated: newUser.updatedAt });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const credentialsSchema = z.object({
            email: z.string().email("Invalid email address"),
            password: z.string().min(6, "Password must be at least 6 characters long"),
        });

        const validation = credentialsSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                msg: "Validation error",
                errors: validation.error.errors,
            });
        }

        const { email, password } = validation.data;

        const user = await User.findOne({ email });
        if (!user || !user.passwordHash) {
            return res.status(400).json({
                msg: "Invalid email or password",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({
                msg: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            msg: "Login successful",
            token,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            msg: "Internal server error",
        });
    }
});





router.get('/me', authMiddleware, async (req, res) => {
    const { userId, role } = req.user;
    const profileData = await User.findById(userId).select('-passwordHash -googleId -__v');
    console.log(profileData);
    res.status(200).json({ msg: "User profile fetched successfully", profileData });
});

module.exports = router;


