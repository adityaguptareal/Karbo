const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const googleClient = require("../config/googleConfig");
const z = require("zod");
const { request } = require("http");

exports.registerUser = async (req, res) => {
    const requiredDataSchema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        role: z.enum(["farmer", "company"]),
    });


    try {
        const validation = requiredDataSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                msg: "Invalid input",
                errors: validation.error.errors
            });
        }

        const { name, email, password, role } = validation.data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                msg: "User already exists",
                existingUser: existingUser._id,
                UserRole: existingUser.role,
                status: existingUser.status,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            passwordHash: hashedPassword,
            role,
        });

        return res.status(201).json({
            msg: "User registered successfully",
            existingUser: newUser._id,
            UserRole: newUser.role,
            status: newUser.status,
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error",
            error: error.message
        });
    }
};



exports.googleAuth = async (req, res) => {
    const { tokenId, role } = req.body;

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, email, name } = payload;

        let existingUser = await User.findOne({ email });

        if (existingUser) {
            if (existingUser.isBlocked) {
                return res.status(403).json({ msg: "Your account has been blocked. Please contact support." });
            }
            return res.status(200).json({
                msg: "User already registered",
                existingUser: existingUser._id,
                UserRole: existingUser.role,
                status: existingUser.status,
                createdAt: existingUser.createdAt,
                updated: existingUser.updatedAt
            });
        }

        const newUser = await User.create({
            name,
            email,
            googleId: sub,
            role,
        });

        return res.status(200).json({
            msg: "User registered successfully",
            existingUser: newUser._id,
            UserRole: newUser.role,
            status: newUser.status
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error",
            error: error.message,
        });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const credentialsSchema = z.object({
            email: z.string().email("Invalid email"),
            password: z.string().min(6, "Password must be at least 6 characters long"),
        });

        const validation = credentialsSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                msg: "Invalid input",
                errors: validation.error.errors
            });
        }

        const { email, password } = validation.data;

        const user = await User.findOne({ email });
        if (!user || !user.passwordHash) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ msg: "Your account has been blocked. Please contact support." });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(400).json({ msg: "Invalid email or password" });
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
            updatedAt: user.updatedAt
        });

    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};


exports.getProfile = async (req, res) => {
    try {
        const { userId } = req.user;

        const profile = await User.findById(userId)
            .select("-passwordHash -googleId -__v");

        return res.status(200).json({
            msg: "User profile fetched",
            profile
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};
