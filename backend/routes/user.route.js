const express = require("express");
const userController = require("../controllers/user.controller.js");
const router = express.Router();

router.post("/", userController.createUser);
router.get("/", userController.readAllUsers);
router.post("/login", userController.readUser);
router.patch("/",userController.updateUser);
router.delete("/",userController.deleteUser);

module.exports = router;