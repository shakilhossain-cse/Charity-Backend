const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Feild Must Be Required"],
      minlength: 3,
      maxlength: 25,
    },
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
    },
    role: {
      type: String,
      enum: ["admin", "author", "member"],
      default: "member",
    },
    email: {
      type: String,
      required: [true, "Name Feild Must Be Required"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "You Must A Valid Email Address",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Name Feild Must Be Required"],
      minlength: 6,
      maxlength: 15,
    },
  },
  { timestamps: true }
);
UserSchema.pre("save", async function (next) {
  const salt = bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
};

UserSchema.methods.comparePassword = async function (userPass) {
  const isMatch = await bcrypt.compare(userPass, this.password);
  return isMatch;
};
module.exports = mongoose.model("User", UserSchema);
