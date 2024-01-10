const User = require("../models/User");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
/**
 * CreateUser - add user into the database, and encrypt user password
 */

async function CreateUser(req, res) {
    try {
        const { email, password, name, isAdmin } = req.body;
        const userExist = await User.findOne({ email })

        if (userExist) {
            res.status(400).json('User already signup, you can login')
            return;
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ email: email, password: hashPassword, name, isAdmin })

        const token = jwt.sign({
            _id: newUser._id,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            name: newUser.name,
        }, process.env.JWT_KEY, { expiresIn: "1hr" })

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        }).status(201).json({
            message: "register user successful",
            createdUser: {
                _id: newUser._id,
                name: newUser.name,
            }
        })
    } catch (error) {
        console.log(error);
    }
}

/**
 * Login - allow user to access their existing account and create a token
 */
const Login = async (req, res) => {
    const { password, email, doNotLogin } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json('Authentication failed');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json('Authentication failed');
        }

        let cookiesParams = {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.JWT_KEY === "production"
        }

        if (doNotLogin) {
            cookiesParams = { ...cookiesParams, maxAge: 1000 * 60 * 60 * 60 * 24 * 7 }
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_KEY, { expiresIn: "1hr" });

        res.cookie("access_token", token, cookiesParams).status(200).json({
            message: "success user login", userLoggedIn: {
                _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, doNotLogin
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { CreateUser, Login }