const express = require('express');
const api = require("./routes/api/index");
require('dotenv').config();
const connectDatabase = require("./config/database");
const cors = require("cors")
const errorMid = require("./middleware/error")
const upload = require("express-fileupload")
const cookieParser = require("cookie-parser")

// CREATE APPLICATION
const app = express();

// ROUTES ENTRY POINT
app.use(express.json());
app.use(cookieParser())
app.use(upload())
app.use(cors());
app.use("/api", api);
app.use(errorMid);

const port = process.env.PORT || 7000;

if (connectDatabase()) {
    app.listen(port, () => {
        console.log(`Application is served @ http://localhost:${port}`);
    })
}