const mongoose = require("mongoose")

const connectDatabase = () => {
    mongoose.connect(
         process.env.DB_URI,
    )
    .then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`)
    })
    // .catch((err) => {
    //     console.log(err)
    // })                      We have seperately handled => "Unhandled Rejection" , so this is not required
}

module.exports = connectDatabase