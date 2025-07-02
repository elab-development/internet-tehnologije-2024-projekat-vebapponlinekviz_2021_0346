const express = require("express");
const userController = require("../controllers/user.controller.js");
const router = express.Router();
const {
  authenticate,
} = require("../middleware/auth.middleware");

router.post("/", userController.createUser);
router.get("/", userController.readAllUsers);
router.post("/login", userController.readUser);
router.patch("/", authenticate, userController.updateUser);
router.delete("/:id", authenticate, userController.deleteUser);

module.exports = router;