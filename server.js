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
app.post("/api/users", function(req, res) {
  const { username: reqUsername } = req.body;
  
  let findOne = User.findOne({
      username: reqUsername
    });

    if (findOne) {
      res.send("Username already taken. Please choose another one.");
    } else {
      const user = new User({
        username: reqUsername,
        exercise: []
      });
    
      
      user.save((err, data) => {
          if (err || data === null) {
            console.error(err);
          } else {
            return res.json({
              username: user.username,
        _id: user._id
            });
          }
        });
    }
      

//   try {
//     let findOne = await User.findOne({
//       username: reqUsername
//     });

//     if (findOne) {
//       res.send("Username already taken. Please choose another one.");
//     } else {
//       const user = new User({
//         username: reqUsername,
//         exercise: []
//       });

//       await user.save();
//       res.json({
//         username: user.username,
//         _id: user._id
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json("Server error...");
//   }
});

// Post exercise
app.post("/api/users/:_id/exercises", async function(req, res) {
  const { description, duration, date } = req.body;
  const { _id } = req.params;
  try {
    const newDate = date
      ? new Date(date).toDateString()
      : new Date().toDateString();
    const exercise = {
      description,
      duration: parseInt(duration),
      date: newDate
    };
    const findOne = await User.findByIdAndUpdate(
      {
        _id
      },
      {
        $push: {
          exercise
        }
      },
      {
        new: true
      }
    );
    if (findOne) {
      const { username } = findOne;

      res.json({
        _id,
        username,
        date: newDate,
        duration: parseInt(duration),
        description
      });
    } else {
      res.send("Unknown id. Please try again.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error...");
  }
});

// Get all users
app.get("/api/users", async function(req, res) {
  try {
    const users = await User.find({})
      .select("username")
      .exec();
    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error...");
  }
});

// Get exercise log
app.get("/api/users/:_id/logs", async function(req, res) {
  try {
    const { _id } = req.params;
    const { from, to, limit } = req.query;
    const findOne = await User.findById({ _id });

    if (findOne) {
      const { username, exercise } = findOne;
      let log = [...exercise];

      if (from) {
        const dateFrom = new Date(from);
        log = log.filter(exercise => exercise.date > dateFrom);
      }

      if (to) {
        const dateTo = new Date(to);
        log = log.filter(exercise => exercise.date < dateTo);
      }

      log = log.sort(
        (firstExercise, secondExercise) =>
          firstExercise.date > secondExercise.date
      );

      if (limit) {
        log = log.slice(0, limit);
      }

      log = log.map(exercise => ({
        description: exercise.description,
        duration: parseInt(exercise.duration),
        date: exercise.date.toDateString()
      }));

      const { length: count } = log;

      res.json({
        _id,
        username,
        count,
        log
      });
    } else {
      res.send("Unknown id. Please try again.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error...");
  }
});

// Not found
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});
