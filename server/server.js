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
const Transcript = require("./models/Transcripts");

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

    socket.on("join-interview", ({ interviewId, role }) => {

        socket.join(interviewId);

        socket.to(interviewId).emit("interview-participant-connected", {
            socketId: socket.id,
            role
        });

        console.log(
            `Socket ${socket.id} joined interview ${interviewId}`
        );

    });

    socket.on("candidate-media-enabled", (interviewId) => {
        socket.to(interviewId).emit("candidate-media-enabled");
    });

    socket.on("webrtc-offer", (data) => {

    socket.to(data.interviewId).emit(
        "webrtc-offer",
        {
            offer: data.offer
        }
    );

});

socket.on("webrtc-answer", (data) => {

    socket.to(data.interviewId).emit(
        "webrtc-answer",
        {
            answer: data.answer
        }
    );

});

socket.on("webrtc-ice-candidate", (data) => {

    socket.to(data.interviewId).emit(
        "webrtc-ice-candidate",
        {
            candidate: data.candidate
        }
    );

});


socket.on("transcript", async (data) => {

    try {

        console.log(
            "Transcript received:",
            data.text
        );

        const transcript = new Transcript({
            interview: data.interviewId,
            speaker: data.speaker || "candidate",
            text: data.text
        });

        await transcript.save();

        io.to(data.interviewId).emit(
            "transcript",
            {
                text: transcript.text,
                speaker: transcript.speaker,
                timestamp: transcript.timestamp
            }
        );

    } catch (err) {

        console.log(
            "Failed to save transcript:",
            err
        );

    }

});



    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });

});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});