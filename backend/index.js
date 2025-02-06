const express = require('express')
const app = express()
const mongoose = require('mongoose');
const port = 2812;

//modeli
const User = require("./models/user.model.js");
const {Category} = require("./models/category.model.js");
const Game = require("./models/game.model.js");

app.get('/', function (req, res) {
  res.send('Hello World')
})


mongoose.connect('mongodb+srv://kacii:rfDXMnkAOeOoZk2W@backend.c88zu.mongodb.net/?retryWrites=true&w=majority&appName=backend')
  .then(() => {
    console.log('Connected!');
    app.listen(port, ()=>{
      console.log("Server is running on port "+port);
    })
    
  })
  .catch(()=> {
    console.log("Connection failed!");
  })