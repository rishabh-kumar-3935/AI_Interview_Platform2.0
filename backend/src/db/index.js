import mongoose from "mongoose"

import {DB_NAME} from "../constant.js"


const connectDB = async()=>{
    try{
        const mongoUrl = process.env.MONGO_URL || "";
        
        if (!mongoUrl) {
            throw new Error("MONGO_URL is not defined in .env file");
        }
        
        const connectionString = mongoUrl.includes("?")
            ? mongoUrl.replace(/\/\?/, `/${DB_NAME}?`)
            : `${mongoUrl}/${DB_NAME}`;

        console.log("Attempting to connect to MongoDB...");
        console.log("Connection string (masked):", connectionString.replace(/:(.+)@/, ":***@"));
        
        const connectionInstance = await mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);

    }catch(error){
        console.error("MONGODB connection error:", error.message);
        console.error("Full error:", error);
        process.exit(1)
    }
}

export default connectDB;