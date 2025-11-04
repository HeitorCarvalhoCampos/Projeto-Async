const Idea = require('../models/Idea');

class IdeaController {
  // Listar ideias
  static async list(req, res) {
    try {
      const ideas = await Idea.find().populate("authorId").sort({ votes: -1 });

      if (req.headers.accept?.includes('application/json')) {
        return res.status(200).json({ message: "Lista de ideias carregada com sucesso", ideas });
      } else {
        return res.render('ideas/list', { ideas });
      }
    } catch (err) {
      if (req.headers.accept?.includes('application/json')) {
        return res.status(500).json({ message: "Erro ao carregar ideias", error: err.message });
      } else {
        req.flash('error', 'Erro ao carregar ideias');
        return res.redirect('/');
      }
    }
  }

  static createPage(req, res) {
    if (req.headers.accept?.includes('application/json')) {
      return res.status(200).json({ message: "Rota de criação de ideias ativa." });
    } else {
      return res.render('ideas/create');
    }
  }

  // Criar ideia
  static async create(req, res) {
    try {
      const { title, description, category } = req.body;

      const idea = new Idea({
        title,
        description,
        category,
        authorId: req.session.user?._id || null,
      });
      await idea.save();

      if (req.headers.accept?.includes('application/json')) {
        return res.status(201).json({ message: "Ideia criada com sucesso!", idea });
      } else {
        req.flash('success', 'Ideia criada com sucesso!');
        return res.redirect('/ideas');
      }
    } catch (err) {
      if (req.headers.accept?.includes('application/json')) {
        return res.status(500).json({ message: "Erro ao criar ideia", error: err.message });
      } else {
        req.flash('error', 'Erro ao criar ideia');
        return res.redirect('/ideas/create');
      }
    }
  }

  // Detalhes
  static async details(req, res) {
    try {
      const idea = await Idea.findById(req.params.id).populate('authorId');
      if (!idea) {
        if (req.headers.accept?.includes('application/json')) {
          return res.status(404).json({ message: "Ideia não encontrada." });
        } else {
          return res.status(404).render('404');
        }
      }

      if (req.headers.accept?.includes('application/json')) {
        return res.status(200).json({ idea });
      } else {
        return res.render('ideas/details', { idea });
      }
    } catch (err) {
      return res.status(500).json({ message: "Erro ao buscar ideia.", error: err.message });
    }
  }

  // Editar
  static async editPage(req, res) {
    const idea = await Idea.findById(req.params.id);
    if (req.headers.accept?.includes('application/json')) {
      return res.status(200).json({ message: "Rota de edição ativa.", idea });
    } else {
      return res.render('ideas/edit', { idea });
    }
  }

  static async update(req, res) {
    try {
      const { title, description, category } = req.body;
      const updated = await Idea.findByIdAndUpdate(req.params.id, { title, description, category }, { new: true });

      if (req.headers.accept?.includes('application/json')) {
        return res.status(200).json({ message: "Ideia atualizada com sucesso!", updated });
      } else {
        req.flash('success', 'Ideia atualizada com sucesso!');
        return res.redirect('/ideas');
      }
    } catch (err) {
      if (req.headers.accept?.includes('application/json')) {
        return res.status(500).json({ message: "Erro ao atualizar ideia.", error: err.message });
      } else {
        req.flash('error', 'Erro ao atualizar ideia');
        return res.redirect('/ideas');
      }
    }
  }

  // Deletar
  static async delete(req, res) {
    try {
      await Idea.findByIdAndDelete(req.params.id);

      if (req.headers.accept?.includes('application/json')) {
        return res.status(200).json({ message: "Ideia removida com sucesso!" });
      } else {
        req.flash('success', 'Ideia removida!');
        return res.redirect('/ideas');
      }
    } catch (err) {
      if (req.headers.accept?.includes('application/json')) {
        return res.status(500).json({ message: "Erro ao remover ideia.", error: err.message });
      } else {
        req.flash('error', 'Erro ao remover ideia');
        return res.redirect('/ideas');
      }
    }
  }
}

module.exports = IdeaController;
