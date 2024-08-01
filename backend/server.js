const app = require("./app")
const cloudinary = require("cloudinary")
const connectDatabase = require("./config/database.js")

// Handling Uncaught Exception
process.on("uncaughtException" , (err) => {
    console.log(`Error:  ${err.message}`)
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
})



if(process.env.NODE_ENV !== "PRODUCTION" )
require("dotenv").config({path: "E:/Chai Aur Code/E-Commerce Project/backend/config/config.env"})

//connecting to a database
connectDatabase()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


 
const server = app.listen( 3000 , () => {

    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})


//Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to handled promise rejection`);

    server.close( () => {
        process.exit(1);
    });
})