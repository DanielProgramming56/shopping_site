const express = require('express');
const api = require("./routes/api/index");
require('dotenv').config();
const connectDatabase = require("./config/database");
const cors = require("cors")

// CREATE APPLICATION
const app = express();

// ROUTES ENTRY POINT
app.use(express.json());
app.use("/api", api);
app.use(cors());

const port = process.env.PORT || 7000;

if (connectDatabase()) {
    app.listen(port, () => {
        console.log(`Application is served @ http://localhost:${port}`);
    })
}