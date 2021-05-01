const mongoose = require('mongoose');
const { Schema, model } = mongoose;
 
const personSchema = new Schema(
  {
    wikiId: { type: String, unique: true },
    name: String,
    description: String,
    birthYear: Number,
    wikiPageUrl: String,
    imageUrl: { type: String, default: null },
    jsonUrl: String,
    basePoints: { type: Number, default: 0 },
  },
  {
    timestamps: true
  }
);
 
module.exports = model('Person', personSchema);