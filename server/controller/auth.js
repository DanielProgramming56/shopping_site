const User = require("../models/User");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
/**
 * CreateUser - add user into the database, and encrypt user password
 */

async function CreateUser(req, res) {
    try {
        const { email, password, name } = req.body;
        const userExist = await User.findOne({ email })

        if (userExist) {
            res.status(400).json('User already signup, you can login')
            return;
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            email, password: hashPassword, name
        })
        await newUser.save()

        res.status(201).json(newUser)
    } catch (error) {
        console.log(error);
    }
}

/**
 * Login - allow user to access their existing account and create a token
 */
const Login = async (req, res) => {
    const { password, email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json('Authentication failed');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json('Authentication failed');
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_KEY, { expiresIn: "1hr" });

        const userWithoutPassword = { ...user.toObject(), password: undefined };
        res.status(200).json({ user: userWithoutPassword, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { CreateUser, Login }