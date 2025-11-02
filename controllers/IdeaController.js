const Idea = require('../models/idea');

class IdeaController {
    // Listar todas as ideias
  static async list(req, res) {
    const ideas = await Idea.find().populate('authorId').sort({ votes: -1 });
    res.render('ideas/list', { ideas });
  }

  static createPage(req, res) {
    res.render('ideas/create');
  }

  // Criar nova ideia
  static async create(req, res) {
    try {
      const { title, description, category } = req.body;
      const idea = new Idea({
        title,
        description,
        category,
        authorId: req.session.user._id,
      });
      await idea.save();
      req.flash('success', 'Ideia criada com sucesso!');
      res.redirect('/ideas');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Erro ao criar ideia');
      res.redirect('/ideas/create');
    }
  }

  // Detalhes da ideia
  static async details(req, res) {
    const idea = await Idea.findById(req.params.id).populate('authorId');
    if (!idea) return res.status(404).render('404');
    res.render('ideas/details', { idea });
  }

  // Editar ideia
  static async editPage(req, res) {
    const idea = await Idea.findById(req.params.id);
    res.render('ideas/edit', { idea });
  }

  static async update(req, res) {
    const { title, description, category } = req.body;
    await Idea.findByIdAndUpdate(req.params.id, { title, description, category });
    req.flash('success', 'Ideia atualizada com sucesso!');
    res.redirect('/ideas');
  }

  // Deletar ideia
  static async delete(req, res) {
    await Idea.findByIdAndDelete(req.params.id);
    req.flash('success', 'Ideia removida!');
    res.redirect('/ideas');
  }
}

module.exports = IdeaController;
