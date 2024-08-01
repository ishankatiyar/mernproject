const express = require("express");
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv");
const path= require("path")



if(process.env.NODE_ENV !== "PRODUCTION" )
    require("dotenv").config({path: "E:/Chai Aur Code/E-Commerce Project/backend/config/config.env"})
    
const app = express();

const errorMiddleware = require("./middleware/error.js")
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

// Route imports
const product = require("./routes/productRoute.js")
const user = require("./routes/userRoute.js")
const order= require("./routes/orderRoute.js")
const payment= require("./routes/paymentRoute.js")

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1",payment);

app.use(express.static(path.join(__dirname,'../frontendd/dist')))

app.get("*",(req,res) => {
    res.sendFile(path.resolve(__dirname,'../frontendd/dist/index.html'))
} )

//MIddleware for Errors
app.use(errorMiddleware);


module.exports = app;