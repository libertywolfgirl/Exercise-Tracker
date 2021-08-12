const mongo = require("mongodb");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");

// Basic Configuration
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// Connect to Database
const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
});

const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "connection error:"));
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// User Schema
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  exercise: [
    {
      description: {
        type: String
      },
      duration: {
        type: Number
      },
      date: {
        type: Date
      }
    }
  ]
});
const User = mongoose.model("User", userSchema);

// User Routes
app.post('/api/users', async function (req, res) {
  const { username: reqUsername } = req.body;
});
