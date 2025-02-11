const mongoose = require("mongoose");

const QuestionSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  choices: {
    type: [String],
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    requred: true,
  },
});

const CategorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    questions: {
      type: [QuestionSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
