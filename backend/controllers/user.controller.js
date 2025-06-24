const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const sanitizeHtml = require("sanitize-html");

// const createUser = async (req, res) => {
//   try {
//     const { name, mail, username, password } = req.body;

//     const existingUser = await User.findOne({ $or: [{ username }, { mail }] });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "Korisničko ime ili mejl su zauzeti." });
//     }

//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const user = await User.create({
//       name,
//       mail,
//       username,
//       password: hashedPassword,
//     });

//     const { password: _, ...userWithoutPassword } = user.toObject();

//     res.status(201).json(userWithoutPassword);
//   } catch (error) {
//     res.status(500).json({ message: "Greška prilikom kreiranja korisnika." });
//   }
// };

const createUser = async (req, res) => {
  try {
    const name = sanitizeHtml(req.body.name);
    const mail = sanitizeHtml(req.body.mail);
    const username = sanitizeHtml(req.body.username);
    const password = req.body.password;

    const existingUser = await User.findOne({ $or: [{ username }, { mail }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Korisničko ime ili mejl su zauzeti." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      mail,
      username,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Greška prilikom kreiranja korisnika." });
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
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronađen" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Pogrešna lozinka" });
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const updateUser = async (req, res) => {
//   const { filter, oldPassword, update } = req.body;

//   try {
//     const user = await User.findOne(filter);

//     if (!user) {
//       return res.status(404).json({ message: "Korisnik nije pronađen" });
//     }

//     // Provera stare lozinke
//     const isOldPasswordCorrect = await bcrypt.compare(
//       oldPassword,
//       user.password
//     );
//     if (!isOldPasswordCorrect) {
//       return res.status(401).json({ message: "Neispravna stara lozinka" });
//     }

//     // Hashiranje nove lozinke ako postoji u update objektu
//     if (update.password) {
//       const saltRounds = 10;
//       update.password = await bcrypt.hash(update.password, saltRounds);
//     }

//     // Update korisnika
//     await User.updateOne(filter, update);

//     // Vraćanje ažuriranih podataka (bez lozinke)
//     const updatedUser = await User.findOne({
//       username: update.username || filter.username,
//     });
//     const { password, ...userWithoutPassword } = updatedUser.toObject();

//     res.status(200).json(userWithoutPassword);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const updateUser = async (req, res) => {
  const { filter, oldPassword, update } = req.body;

  try {
    const user = await User.findOne(filter);

    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronađen" });
    }

    // Provera stare lozinke
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );
    if (!isOldPasswordCorrect) {
      return res.status(401).json({ message: "Neispravna stara lozinka" });
    }

    // Očisti korisnički unos od XSS
    if (update.name) update.name = sanitizeHtml(update.name);
    if (update.mail) update.mail = sanitizeHtml(update.mail);
    if (update.username) update.username = sanitizeHtml(update.username);

    // Ako se menja lozinka, heširaj je
    if (update.password) {
      const saltRounds = 10;
      update.password = await bcrypt.hash(update.password, saltRounds);
    }

    // Ažuriraj korisnika
    await User.updateOne(filter, update);

    const updatedUser = await User.findOne({
      username: update.username || filter.username,
    });
    const { password, ...userWithoutPassword } = updatedUser.toObject();

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// const deleteUser = async (req, res) => {
//   try {
//     let result = await User.deleteOne(req.body);
//     if (result.deletedCount > 0)
//       res.status(204).json({ message: "Uspešno brisanje korisnika" });
//     else res.status(404).json({ message: "Korisnik nije pronađen" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const deleteUser = async (req, res) => {
  try {
    let {id} = req.params;
    let result = await User.findByIdAndDelete(id);
    if (result)
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
