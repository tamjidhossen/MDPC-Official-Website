//models/Contest.js
const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: { type: Date, required: true },
  duration: { type: Number, required: true }, 
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }]
});

module.exports = mongoose.model("Contest", contestSchema);
