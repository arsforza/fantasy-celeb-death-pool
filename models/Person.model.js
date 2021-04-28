const mongoose = require('mongoose');
const { Schema, model } = mongoose;
 
const personSchema = new Schema(
  {
    wikiId: { type: String, unique: true },
    name: String,
    description: String,
    birthYear: Number,
    deathYear: { type: Number, default: null },
    wikiPageUrl: String,
    imageUrl: String,
    jsonUrl: String
  },
  {
    timestamps: true
  }
);
 
module.exports = model('Person', personSchema);