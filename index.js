import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import Auth from "./Routes/Auth";
import Auth from "./Routes/AuthRoute.js";
import User from "./Routes/UserRoute.js";
import Product from "./Routes/ProductRoute.js";
import Review from "./Routes/ReviewRoute.js";
import Query from "./Routes/QueryRoute.js";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import ProductRequest from "./Routes/ProductRequestRoute.js";
import Messsage from "./Routes/MessageRoute.js";

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




//Socket Io
import { Server } from 'socket.io'; //replaces (import socketIo from 'socket.io')
import { createServer } from 'http';
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: 'http://localhost:3000',credentials: true, } });


global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});


app.use("/api/auth", Auth);
app.use("/api/user", User);
app.use("/api/product", Product);
app.use("/api/review", Review);
app.use('/api/query',Query)
app.use('/api/request',ProductRequest)
app.use("/api/messages", Messsage);




mongoose.connect(process.env.MONGO_URL) 
    .then(() => console.log("Connected With DB Successfull"))
    .catch((e) => console.log("Db Connection Failed"));


app.listen(port, () => {
    console.log(`Server is Listening on PORT ${port}`);
})
