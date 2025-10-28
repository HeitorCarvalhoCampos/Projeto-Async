const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // lista de usuários que votaram
  createdAt: { type: Date, default: Date.now }
});

// Virtual para contar votos facilmente
ideaSchema.virtual('voteCount').get(function() {
  return this.votes.length;
});

module.exports = mongoose.model('Idea', ideaSchema);
