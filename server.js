import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from "morgan";
import connectDB from './config/db.js';
import authRoutes from './routes/authRouter.js';
import categoryRoute from "./routes/categoryRoutes.js";
import productRoute from "./routes/productRoutes.js"
import path from "path";
import { fileURLToPath } from "url"

import cors from "cors"

dotenv.config(); // Used like this becoz .env file at root if not then put path in parameter

// REST OBJ
const app = express();

// DATABSE CONNECTION
connectDB();

// ENABLE CORS (CORS USED FOR PROVIDING PATH TO CONNECT TWO DIFF HOSTS WITHOU CROSS ORIGIN ERROR)
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);


// MIDDLEWARES
app.use(express.json());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, './client/build')));

// ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);


app.use("*", function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
});


// REST API
//app.get('/', (req, res) => {
  //  res.send("Welocme to Ecomm")
//})
const PORT = process.env.PORT || 8080; 
app.listen(PORT, () => {
    console.log(`server running at ${PORT}`.bgCyan.white);
})
