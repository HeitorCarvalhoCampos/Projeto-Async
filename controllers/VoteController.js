const Idea = require('../models/idea');

class VoteController {
  static async toggleVote(req, res) {
    const ideaId = req.params.id;
    const userId = req.session.user._id;

    const idea = await Idea.findById(ideaId);
    if (!idea) return res.status(404).send('Ideia não encontrada');

    const alreadyVoted = idea.votes.includes(userId);
    if (alreadyVoted) {
      idea.votes.pull(userId); // remove voto
    } else {
      idea.votes.push(userId); // adiciona voto
    }

    await idea.save();
    res.redirect('/ideas');
  }
}

module.exports = VoteController;
