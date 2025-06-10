const User = require("../models/user.model.js");

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: "Korisničko ime ili mejl su zauzeti." });
  }
};

const readAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const readUser = async (req, res) => {
  try {
    const user = await User.findOne(req.body);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Korisnik nije pronađen" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    let updateStatus = await User.updateOne(req.body.filter, req.body.update);
    if (updateStatus.matchedCount === 0) {
      return res.status(404).json("Korisnik nije pronađen");
    }
    const usernameToSearch = req.body.update.username || req.body.filter.username;
    const updatedUser = await User.findOne({ username: usernameToSearch });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    let result = await User.deleteOne(req.body);
    if(result.deletedCount > 0)
      res.status(204).json({ message: "Uspešno brisanje korisnika" });
    else res.status(404).json({ message: "Korisnik nije pronađen" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userController = {
  createUser,
  readAllUsers,
  readUser,
  updateUser,
  deleteUser,
};

module.exports = userController;
