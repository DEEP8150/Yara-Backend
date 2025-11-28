import mongoose from "mongoose";
import { DB_Name } from "../Constants.js";

const DBConnection = async() => {
    try {
        const DBConnect = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)

        console.log(`MongoDB connected : host name : ${DBConnect.connection.host}`)
        //just to check where i am connected
    } catch (error) {
        console.log("MONGODB connection error",error);
        process.exit(1)
    }
}

export default DBConnection