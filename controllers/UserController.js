const User = require('../models/User');

class UserController {
    // Registro de usuário
  static registerPage(req, res) {
    res.render('users/register');
  }

  static async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const userExists = await User.findOne({ email });
      if (userExists) {
        req.flash('error', 'E-mail já cadastrado');
        return res.redirect('/users/register');
      }

      const user = new User({ name, email, password });
      await user.save();

      req.flash('success', 'Cadastro realizado com sucesso!');
      res.redirect('/users/login');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Erro ao registrar');
      res.redirect('/users/register');
    }
  }

  // Login de usuário
  static loginPage(req, res) {
    res.render('users/login');
  }

  static async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.checkPassword(password))) {
      req.flash('error', 'E-mail ou senha inválidos');
      return res.redirect('/users/login');
    }

    req.session.user = user;
    req.flash('success', 'Login realizado com sucesso');
    res.redirect('/ideas');
  }

  // Logout de usuário
  static logout(req, res) {
    req.session.destroy(() => res.redirect('/users/login'));
  }
}

module.exports = UserController;
