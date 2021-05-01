const mongoose = require('mongoose');
const { Schema, model } = mongoose;
 
const betSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, model: 'User' },
    year: { type: Number },
    people: [{ type: Schema.Types.ObjectId, model: 'Person' }],
    points: { type: Number, default: 0 },
  },
  {
    timestamps: true
  }
);
 
module.exports = model('Bet', betSchema);