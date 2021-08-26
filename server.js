const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
//const db = process.env.DATABASE_URI;
const PORT = process.env.PORT || 3000;

//Connnect DB
//connectDB(db);

app.use(cors());

app.options("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,Content-Length,X-Requested-With"
  );
  res.send(200);
});

app.use(express.json());
//For HTML use
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

//Static routes
app.use(express.static("public"));
app.use(express.static("css"));

//Take a info from specify file.
const timeRoutes = require("./routes/time");
const nameRoutes = require("./routes/name");
const jsonRoutes = require("./routes/json");
const echoAllRoutes = require("./routes/echo-all");
const { connect } = require("./routes/time");

//Specifity route for file
app.use("/routes/time", timeRoutes);
app.use("/routes/name", nameRoutes);
app.use("/routes/json", jsonRoutes);
app.use("/routes/echo-all", echoAllRoutes);

//Router
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/form", (req, res) => {
  res.sendFile(__dirname + "/views/form.html");
});

app.get("/:word/echo", (req, res) => {
  res.json({ echo: req.params.word });
});

app.all("*", (req, res) => {
  res.send("Invalid route");
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
