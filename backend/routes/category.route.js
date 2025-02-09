const express = require("express");
const categoryController = require("../controllers/category.controller.js");
const router = express.Router();

router.post("/",categoryController.createCategory);
router.get("/",categoryController.readAllCategories)
router.get("/:id",categoryController.readCategory);
router.patch("/:id",categoryController.updateCategory);
router.delete("/:id",categoryController.deleteCategory);

module.exports = router;