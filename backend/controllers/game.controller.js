const Game = require("../models/game.model.js");
const User = require("../models/user.model.js");
const Category = require("../models/category.model.js");
const { default: mongoose } = require("mongoose");

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

const getPlayerBestScores = async (req, res) => {
  try {
    const { playerId } = req.params;

    // 1. Uzimamo sve kategorije
    const categories = await Category.find();

    // 2. Uzimamo najbolje rezultate po kategoriji za datog igrača
    const bestScores = await Game.aggregate([
      { $match: { player: new mongoose.Types.ObjectId(playerId) } },
      {
        $group: {
          _id: "$category",
          bestScore: { $max: "$score" },
        },
      },
    ]);

    // 3. Pretvaramo rezultate u Map
    const scoreMap = new Map();
    bestScores.forEach((item) => {
      scoreMap.set(item._id.toString(), item.bestScore);
    });

    // 4. Kombinujemo sve kategorije sa rezultatom (ili 0 ako ga nema)
    const result = categories.map((category) => {
      return {
        categoryId: category._id,
        categoryTitle: category.title,
        score: scoreMap.get(category._id.toString()) || 0,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const gameController = {
  createGame,
  readAllGames,
  readGame,
  updateGame,
  deleteGame,
  getPlayerBestScores,
};

module.exports = gameController;
