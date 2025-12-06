const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const z = require("zod");
const jwt = require("jsonwebtoken");
const createAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admin can create another admin" });
    }

    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(6)
    });

    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        msg: "Invalid admin data",
        errors: validation.error.errors,
      });
    }

    const { name, email, password } = validation.data;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      role: "admin",
      status: "verified"
    });

    return res.status(201).json({
      msg: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });

  } catch (error) {
    console.error("createAdmin error:", error);
    return res.status(500).json({
      msg: "Server error",
      error: error.message
    });
  }
};


module.exports = {
  createAdmin,
  
};

