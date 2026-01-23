import mongoose from "mongoose";
import { DB_Name } from "../Constants.js";

const DBConnection = async () => {
    try {
        // const DBConnect = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        const DBConnect = await mongoose.connect(`${process.env.MONGODB_URI_DEVELOPMENT}/${DB_Name}`)

        //just to check where i am connected
    } catch (error) {
        process.exit(1)
    }
}

export default DBConnection