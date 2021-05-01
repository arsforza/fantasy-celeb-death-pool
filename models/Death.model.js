const mongoose = require('mongoose');
const { Schema, model } = mongoose;
 
const deathSchema = new Schema(
  {
    person: { type: Schema.Types.ObjectId, model: 'Person' },
    year: { type: Number },
  },
  {
    timestamps: true
  }
);
 
module.exports = model('Death', deathSchema);