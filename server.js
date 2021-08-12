const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const cors = require('cors')

// Basic Configuration
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyParser.json());

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

// Connect to Database
