import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import Auth from "./Routes/Auth";
import Auth from "./Routes/AuthRoute.js";
import User from "./Routes/UserRoute.js";
import Product from "./Routes/ProductRoute.js";
import Review from "./Routes/ReviewRoute.js";
import cors from 'cors'
import cookieParser from 'cookie-parser'
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    methods: ["GET" ,"PUT" , "POST" , "DELETE"],
}))
const port = process.env.PORT || 5000;

app.use("/api/auth", Auth);
app.use("/api/user", User);
app.use("/api/product", Product);
app.use("/api/review", Review);

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected With DB Successfull"))
    .catch((e) => console.log("Db Connection Failed"));


app.listen(port, () => {
    console.log(`Server is Listening on PORT ${port}`);
})