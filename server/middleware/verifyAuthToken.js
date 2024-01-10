const jwt = require("jsonwebtoken")
const verifyIsLoggedIn = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(403).send("A token is required for authentication")
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY)
            req.user = decoded;
            console.log(req.user);
            next()
        } catch (error) {
            return res.status(401).send("Unauthorized. Invalid Token")
        }
    } catch (error) {
        next(error)
    }
}

const verifyIsAdmin = (req, res, next) => {
        if (req.user && req.user.isAdmin) {
            next()
        } else{
            return res.status(401).json("unauthorized endpoint")
        }
    
}

module.exports = { verifyIsLoggedIn, verifyIsAdmin }