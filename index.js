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
  methods: ["GET", "PUT", "POST", "DELETE"],
}))
const port = process.env.PORT || 5000;






app.use("/api/auth", Auth);
app.use("/api/user", User);
app.use("/api/product", Product);
app.use("/api/review", Review);
app.use('/api/query', Query)
app.use('/api/request', ProductRequest)
app.use("/api/message", Messsage);




mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected With DB Successfull"))
  .catch((e) => console.log("Db Connection Failed"));


const server = app.listen(port, () => {
  console.log(`Server is Listening on PORT ${port}`);
})


//Socket Io
// import { Server } from 'socket.io';

// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3000',
//     credentials: true,
//   }
// });


// global.onlineUsers = new Map();
// io.on("connection", (socket) => {
//   global.chatSocket = socket;

//   socket.on("add-user", (userId) => {
//     // console.log("Added ", userId);
//     onlineUsers.set(userId, socket.id);
//   });

//   socket.on("send-msg", (data) => {
//     // console.log(data);
//     // console.log(onlineUsers);
//     const sendUserSocket = onlineUsers.get(data.to);
//     // console.log(sendUserSocket);
//     if (sendUserSocket) {
//       console.log("Mesg REceive fired");
//       socket.to(sendUserSocket).emit("msg-recieve", data.msg);
//     }
//   });
// });
