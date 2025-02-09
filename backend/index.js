const express = require('express')
const app = express()
const mongoose = require('mongoose');
const port = 2812;

//middleware
app.use(express.json());

//modeli
const {Category} = require("./models/category.model.js");
const Game = require("./models/game.model.js");

//rute
const userRouter = require("./routes/user.route.js");
const gameRouter = require("./routes/game.route.js");
app.use("/api/users", userRouter);
app.use("/api/games", gameRouter);

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
  .catch((e)=> {
    console.log("Connection failed! "+e);
  })