const express = require("express");
const gameController = require("../controllers/game.controller.js");
const router = express.Router();

router.post("/", gameController.createGame);
router.get("/", gameController.readAllGames);
router.get("/:id", gameController.readGame);
router.patch("/:id", gameController.updateGame);
router.delete("/:id", gameController.deleteGame);
router.get("/best/:playerId", gameController.getPlayerBestScores);
router.get("/admin/stats", gameController.getAdminStats);
router.get("/admin/paginatedGames", gameController.getPaginatedGames);

module.exports = router;