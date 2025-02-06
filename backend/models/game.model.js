const mongoose = require("mongoose");
const { CategorySchema } = require("./category.model.js");

const GameSchema = mongoose.Schema(
    {
        category:{
            type: CategorySchema,
            requred: true
        },
        player:{
            type: String,
            requred: true
        },
        score:{
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Game = mongoose.model("Game",GameSchema);
module.exports = Game;