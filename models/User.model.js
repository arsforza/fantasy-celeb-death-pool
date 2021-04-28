const mongoose = require('mongoose');
const { Schema, model } = mongoose;
 
const userSchema = new Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    passwordHash: { type: String },
    role: { type: String }
  },
  {
    timestamps: true
  }
);
 
module.exports = model('User', userSchema);