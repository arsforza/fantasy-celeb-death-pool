const mongoose = require('mongoose');
const { Schema, model } = mongoose;
 
const betSchema = new Schema(
  {
    betYear: Number,
    user: { type: Schema.Types.ObjectId, model: User },
    people: [{ type: Schema.Types.ObjectId, model: Person }],
    doubleBet: [{ type: Schema.Types.ObjectId, model: Person }],
    points: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);
 
module.exports = model('Bet', betSchema);