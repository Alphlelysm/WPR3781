const User = require("../Models/Users");
const bcrypt = require("bcrypt");


// Register
const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        // Check duplicate email
        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            return res.status(400)
                .send("Email already exists");
        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Save user
        await User.create({
            name,
            email,
            password: hashedPassword
        });


        res.redirect("/login");

    } catch (error) {

        res.status(500)
            .send(error.message);

    }

};



// Login
const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const user =
            await User.findOne({ email });

        if (!user) {
            return res.status(404)
                .send("User not found");
        }


        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
            return res.status(400)
                .send("Invalid credentials");
        }


        req.session.user = user;

        res.redirect("/");

    } catch (error) {

        res.status(500)
            .send(error.message);

    }

};


module.exports = {
    registerUser,
    loginUser
};