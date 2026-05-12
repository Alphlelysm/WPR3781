const User = require("../Models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// =====================
// REGISTER
// =====================
const registerUser = async (req, res) => {
    try {

        console.log("REGISTER HIT:", req.body);

        const { name, email, password } = req.body;

        // check duplicate email (IMPORTANT: Email with capital E)
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send("Email already exists");
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // SAVE USER (MATCH SCHEMA EXACTLY)
        const newUser = await User.create({
             name,
             email,
            password: hashedPassword,
            role: "user"
        });

        console.log("USER SAVED:", newUser);

        return res.redirect("/login");

    } catch (error) {
        console.log("REGISTER ERROR:", error);
        return res.status(500).send(error.message);
    }
};


// LOGIN
// =====================
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

    
        const user = await User.findOne({  email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET || "secret123",
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
            user
        });

    } catch (error) {
        return res.status(500).send(error.message);
    }
};

module.exports = {
    registerUser,
    loginUser
};