import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || ""

const connectToDatabase = async () => {
    try{
        await mongoose.connect(MONGODB_URI)

        console.log("Database connected successfully")
    }catch(error){
        console.error("Error connecting to database:", error)
    }
}

export default connectToDatabase