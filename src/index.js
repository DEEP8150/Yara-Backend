import dotenv from 'dotenv'
import DBConnection from "./Database/DBConnection.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})

DBConnection()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`server is running on PORT: ${process.env.PORT || 5000}`)
        })
    })
    .catch("mongodb connection failed !!")