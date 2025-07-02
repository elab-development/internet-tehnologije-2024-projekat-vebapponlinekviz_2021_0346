const express = require("express");
const gameController = require("../controllers/game.controller.js");
const router = express.Router();
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/auth.middleware");

router.post("/", authenticate, gameController.createGame);
router.get("/", gameController.readAllGames);
router.get("/:id", gameController.readGame);
router.patch("/:id", authenticate, authorizeAdmin, gameController.updateGame);
router.delete("/:id", authenticate, authorizeAdmin, gameController.deleteGame);
router.get("/best/:playerId", authenticate, gameController.getPlayerBestScores);
router.get(
  "/admin/stats",
  authenticate,
  authorizeAdmin,
  gameController.getAdminStats
);
router.get(
  "/admin/paginatedGames",
  authenticate,
  authorizeAdmin,
  gameController.getPaginatedGames
);
router.get(
  "/:playerId/stats/gameCount",
  authenticate,
  gameController.getGamesCountByCategoryForPlayer
);
router.get(
  "/:playerId/stats/allGames",
  authenticate,
  gameController.readAllGamesByPlayer
);

module.exports = router;
