const mongoose = require("mongoose");
const Game = require("./game.model");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    mail: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    admin: {
      type: Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("findOneAndDelete", async function (next) {
  const filter = this.getFilter();
  const user = await this.model.findOne(filter);
  if (user) {
    await Game.deleteMany({ player: user._id }); //briše sve igre povezane s korisnikom
  }
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
