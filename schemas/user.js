const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nickname: { 
    type: String,
    required: true,
    unique: true,
    Minlength: 3
  },
  password: { 
    type: String,
    required: true,
    Minlength: 4
  },
});

UserSchema.virtual("userId").get(function () { 
  return this._id.toHexString(); //가상의 userId 값을 만듦
});

UserSchema.set("toJSON", { //Json이 될 때 userId 값을 출력
  virtuals: true,
});

module.exports = mongoose.model("User", UserSchema);