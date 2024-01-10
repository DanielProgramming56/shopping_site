const { log } = require("console");
const redis = require("redis");
const { promisify } = require("util");

async function redisClient() {
    console.log(process.env.REDIS_PORT)
    console.log(process.env.REDIS_HOST)
    const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

    // Add promisified functions directly to the client object
    client.getAsync = promisify(client.get).bind(client);
    client.setAsync =  promisify(client.set).bind(client);

    // Logging to check if promisified functions are properly added
    console.log('Redis client created:');

    client.on('ready', function () {
        console.log('Connected to Redis');
    });

    client.on('error', function (err) {
        console.error('Error connecting to Redis:', err.message);
        // You might choose to handle this error differently based on your application's needs
        // For example, you could log the error, attempt reconnection, or gracefully handle the situation.
    });

    return client;
}

module.exports = redisClient;
