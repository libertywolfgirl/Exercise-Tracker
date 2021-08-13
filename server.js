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
  serverSelectionTimeoutMS: 5000,
  useFindAndModify: false
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
        type: String,
        required: true
      },
      duration: {
        type: Number,
        required: true
      },
      date: {
        type: Date
      }
    }
  ]
});

const User = mongoose.model("User", userSchema);

// User Routes

// Post user
app.post("/api/users", async function(req, res) {
  const { username: reqUsername } = req.body;

  try {
    let findOne = await User.findOne({
      username: reqUsername
    });

    if (findOne) {
      res.send("Username already taken. Please choose another one.");
    } else {
      const user = new User({
        username: reqUsername,
        exercise: []
      });

      await user.save();
      res.json({
        username: user.username,
        _id: user._id
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error...");
  }
});

// Post exercise
app.post("/api/users/:_id/exercises", async function(req, res) {
  const { userId: _id, description, duration, date } = req.body;
  try {
    const newDate = date
      ? new Date(date).toDateString()
      : new Date().toDateString();
    console.log(_id);
    const exercise = { description, duration, date: newDate };
    
    let findOne = await User.findOneAndUpdate(_id, exercise, {
      new: true
    });

    if (findOne) {
      const { username } = findOne;

      res.json({
        _id,
        username,
        description,
        duration,
        date
      });
    } else {
      res.send("Unknown id. Please try again.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error...");
  }
});
