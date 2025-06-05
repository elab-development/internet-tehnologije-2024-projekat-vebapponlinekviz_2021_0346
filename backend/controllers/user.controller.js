const User = require("../models/user.model.js");

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({message: "Korisničko ime ili mejl su zauzeti."});
  }
};

const readAllUsers = async (req,res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
         res.status(404).json({message: error.message});
    }
};

const readUser = async (req, res) => {
    try {
        const user = await User.findOne(req.body);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({message: "Korisnik nije pronađen"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateUser =  async (req, res) => {
    try {
        await User.updateOne(req.body.filter, req.body.update);
        const updatedUser = await User.findOne(req.body.filter);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

const deleteUser = async (req,res)=>{
    try {
        await User.deleteOne(req.body);
        res.status(204).json({message:"User deleted"});
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

const userController = {
    createUser,
    readAllUsers,
    readUser,
    updateUser,
    deleteUser
};

module.exports = userController;
