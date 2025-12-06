const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const z = require("zod");

exports.getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-passwordHash -googleId -__v");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({ msg: "Profile fetched", user });
    } catch (err) {
        return res.status(500).json({ msg: "Server error", error: err.message });
    }
};


exports.updateUser = async (req, res) => {
    const updateSchema = z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    });

    try {
        const validation = updateSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ msg: "Invalid input", errors: validation.error.errors });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            validation.data,
            { new: true }
        ).select("-passwordHash -googleId -__v");

        return res.status(200).json({
            msg: "User updated successfully",
            user: updatedUser,
        });

    } catch (err) {
        return res.status(500).json({ msg: "Server error", error: err.message });
    }
};




exports.changePassword = async (req, res) => {
    const passwordSchema = z.object({
        oldPassword: z.string().min(6),
        newPassword: z.string().min(6),
    });

    try {
        const validation = passwordSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ msg: "Validation error", errors: validation.error.errors });
        }

        const { oldPassword, newPassword } = validation.data;

        const user = await User.findById(req.user.userId);
        if (!user || !user.passwordHash) {
            return res.status(400).json({ msg: "User not found or password not set" });
        }

        const isOldCorrect = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isOldCorrect) {
            return res.status(400).json({ msg: "Old password is wrong" });
        }

        const hashedNew = await bcrypt.hash(newPassword, 10);

        user.passwordHash = hashedNew;
        await user.save();

        return res.status(200).json({ msg: "Password changed successfully" });

    } catch (err) {
        return res.status(500).json({ msg: "Server error", error: err.message });
    }
};
