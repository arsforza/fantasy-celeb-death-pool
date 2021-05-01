const mongoose = require('mongoose');
const { Schema, model } = mongoose;
 
const userSchema = new Schema(
  {
    username: { type: String, unique: true, trim: true },
    passwordHash: { type: String, trim: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  {
    timestamps: true
  }
);
 
module.exports = model('User', userSchema);