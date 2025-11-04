const Idea = require('../models/Idea');

class VoteController {
  static async toggleVote(req, res) {
    try {
      const ideaId = req.params.id;
      const userId = req.session.user?._id;

      const idea = await Idea.findById(ideaId);
      if (!idea) {
        if (req.headers.accept?.includes('application/json')) {
          return res.status(404).json({ message: "Ideia não encontrada." });
        } else {
          req.flash('error', 'Ideia não encontrada');
          return res.redirect('/ideas');
        }
      }

      const alreadyVoted = idea.votes.includes(userId);
      if (alreadyVoted) {
        idea.votes.pull(userId);
      } else {
        idea.votes.push(userId);
      }

      await idea.save();

      if (req.headers.accept?.includes('application/json')) {
        return res.status(200).json({ message: "Voto atualizado com sucesso!", votes: idea.votes.length });
      } else {
        req.flash('success', 'Voto registrado!');
        return res.redirect('/ideas');
      }
    } catch (err) {
      console.error(err);
      if (req.headers.accept?.includes('application/json')) {
        return res.status(500).json({ message: "Erro ao processar voto." });
      } else {
        req.flash('error', 'Erro ao processar voto');
        return res.redirect('/ideas');
      }
    }
  }
}

module.exports = VoteController;
