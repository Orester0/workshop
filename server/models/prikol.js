const mongoose = require('mongoose');

const prikolSchema = new mongoose.Schema({
  text: { type: String, required: true },
  possibleReactions: { type: [String], required: true },
  reactions: { type: Map, of: Number, default: {} }
});

module.exports = mongoose.model('Prikol', prikolSchema);