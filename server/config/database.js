const mongoose = require("mongoose")

/**
 * connectDatabase - connect to mongoose DB
 */

async function connectDatabase() {
    try {
       await mongoose.connect(process.env.MONGO_URI);
       console.log('connected successfully');
       mongoose.set('debug', true)
    } catch (error) {
        console.log(error.message);
    }
}

module.exports =  connectDatabase;