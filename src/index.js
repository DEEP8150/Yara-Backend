import dotenv from 'dotenv'
import DBConnection from "./Database/DBConnection.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})

DBConnection()
.then(()=> {
    app.listen(process.env.PORT || 7000 , () => {
        console.log(`server is running on PORT: ${process.env.PORT}`)
    })
})
.catch("mongodb connection failed !!")