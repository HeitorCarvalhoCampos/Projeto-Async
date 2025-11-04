const Idea = require('../models/Idea');

module.exports = async function(req, res, next) {
  const idea = await Idea.findById(req.params.id);
  if (!idea || idea.authorId.toString() !== req.session.user._id.toString()) {
    req.flash('error', 'Você não tem permissão para editar esta ideia');
    return res.redirect('/ideas');
  }
  next();
};
