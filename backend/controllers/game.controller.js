const Game = require("../models/game.model.js");
const User = require("../models/user.model.js");
const Category = require("../models/category.model.js");

const createGame = async (req, res) => {
  try {
    const { player, category } = req.body;

    const userExists = await User.findById(player);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const readAllGames = async (req, res) => {
  try {
    const games = await Game.find({});
    res.status(200).json(games);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const readGame = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);
    res.status(200).json(game);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    await Game.findByIdAndDelete(id);
    res.status(204).json({ message: "Game deleted!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const gameController = {
  createGame,
  readAllGames,
  readGame,
  updateGame,
  deleteGame,
};

module.exports = gameController;
