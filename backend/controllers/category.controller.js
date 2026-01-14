const Category  = require("../models/category.model.js");

const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const readAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// const readCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const category = await Category.findById(id);
//     res.status(200).json(category);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(204).json({ message: "Category deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const categoryController = {
  createCategory,
  readAllCategories,
  // readCategory,
  updateCategory,
  deleteCategory,
};

module.exports = categoryController;
