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

const getAdminStats = async (req, res) => {
  try {
    const totalPlayers = await User.countDocuments();
    const totalGames = await Game.countDocuments();

    const bestByCategory = await Category.aggregate([
      {
        $lookup: {
          from: "games",
          let: { categoryId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$category", "$$categoryId"] } } },
            { $sort: { score: -1 } },
            { $limit: 1 },
            {
              $lookup: {
                from: "users",
                localField: "player",
                foreignField: "_id",
                as: "playerData",
              },
            },
            {
              $unwind: {
                path: "$playerData",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                score: 1,
                username: "$playerData.username",
              },
            },
          ],
          as: "bestGame",
        },
      },
      {
        $project: {
          category: "$title",
          bestGame: { $arrayElemAt: ["$bestGame", 0] },
        },
      },
      {
        $project: {
          category: 1,
          username: "$bestGame.username",
          score: { $ifNull: ["$bestGame.score", 0] },
        },
      },
    ]);

    res.status(200).json({ totalPlayers, totalGames, bestByCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaginatedGames = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 4;
    const skip = (page - 1) * limit;
    const category = req.query.category;

    const query = {};
    if (category) {
      query.category = category;
    }

    const totalGames = await Game.countDocuments(query);

    const games = await Game.find(query)
      .populate("player", "username")
      .populate("category", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      games,
      totalGames,
      totalPages: Math.ceil(totalGames / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getGamesCountByCategoryForPlayer = async (req, res) => {
  try {
    const { playerId } = req.params;

    const categories = await Category.find();

    // Grupisanje igara po kategoriji za datog igrača
    const gameCounts = await Game.aggregate([
      {
        $match: {
          player: new mongoose.Types.ObjectId(playerId),
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // Mapiranje rezultata u Map za lak pristup
    const countMap = new Map();
    gameCounts.forEach((item) => {
      countMap.set(item._id.toString(), item.count);
    });

    // Kombinacija svih kategorija sa brojem igara (ili 0 ako nema)
    const result = categories.map((category) => ({
      categoryId: category._id,
      categoryTitle: category.title,
      gamesPlayed: countMap.get(category._id.toString()) || 0,
    }));

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
  getAdminStats,
  getPaginatedGames,
  getGamesCountByCategoryForPlayer
};

module.exports = gameController;
