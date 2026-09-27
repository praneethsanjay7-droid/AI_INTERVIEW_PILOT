require("dotenv").config();
const express = require("express");
const app=express();
const path = require("path");
const cloudinary=require("./config/cloudinary");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cookieParser=require("cookie-parser");
const http=require("http");
const server=http.createServer(app);
const {Server}=require("socket.io");
const io=new Server(server);

connectDB();


const PORT = 5000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const protect=require("./middleware/authMiddleware");
const interviewRoutes=require("./routes/interviewRoutes");
const dashboardRoutes=require("./routes/dashboardRoutes");
const jobRoutes=require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
app.get("/", (req, res) => {
    res.render("login");
});

app.use("/", authRoutes);
app.use("/",interviewRoutes);
app.use("/", dashboardRoutes);
app.use("/",jobRoutes);
app.use("/",applicationRoutes);

io.on("connection", (socket) => {

    console.log("A user connected:", socket.id);

    socket.on("join-interview", (interviewId) => {

        socket.join(interviewId);

        console.log(
            `Socket ${socket.id} joined interview ${interviewId}`
        );

    });

socket.on("transcript", (data) => {

    console.log(
        "Transcript received:",
        data.text
    );

    io.to(data.interviewId).emit(
        "transcript",
        {
            text: data.text
        }
    );

});


    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });

});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});