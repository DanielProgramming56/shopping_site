// middleware/redis.js
const redisClient = require("../config/redis");

module.exports = async (req, res, next) => {
    try {
        req.redisClient = req.redisClient || (await redisClient());
        next();
    } catch (error) {
        console.error('Error connecting to Redis:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
