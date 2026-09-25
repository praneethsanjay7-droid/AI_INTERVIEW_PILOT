const express = require("express");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cookieParser=require("cookie-parser");

connectDB();

const app = express();

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
app.get("/", (req, res) => {
    res.render("login");
});

app.use("/", authRoutes);
app.use("/",interviewRoutes);
app.use("/", dashboardRoutes);
app.use("/",jobRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});