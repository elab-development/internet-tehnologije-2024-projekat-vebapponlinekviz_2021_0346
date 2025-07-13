const express = require("express");
const categoryController = require("../controllers/category.controller.js");
const router = express.Router();

const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/auth.middleware");

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  categoryController.createCategory
);
router.get("/", categoryController.readAllCategories);
// router.get("/:id", categoryController.readCategory);
router.patch(
  "/:id",
  authenticate,
  authorizeAdmin,
  categoryController.updateCategory
);
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  categoryController.deleteCategory
);

module.exports = router;
