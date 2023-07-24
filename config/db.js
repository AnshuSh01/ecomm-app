import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDb ${conn.connection.host}`.bgMagenta.white);
    }
    catch(error) {
        console.log(`Error in db.js File ${error}`.bgRed.white);
    }
}

export default connectDB;