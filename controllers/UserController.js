const User = require('../models/User');

class UserController {
  // Página de registro
  static registerPage(req, res) {
    if (req.headers.accept?.includes('application/json')) {
      return res.status(200).json({ message: "Rota de registro de usuário ativa." });
    } else {
      return res.render('users/register');
    }
  }

  // Registro de usuário
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const userExists = await User.findOne({ email });

      if (userExists) {
        if (req.headers.accept?.includes('application/json')) {
          return res.status(400).json({ message: "E-mail já cadastrado." });
        } else {
          req.flash('error', 'E-mail já cadastrado');
          return res.redirect('/users/register');
        }
      }

      const user = new User({ name, email, password });
      await user.save();

      if (req.headers.accept?.includes('application/json')) {
        return res.status(201).json({
          message: "Usuário registrado com sucesso!",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
          }
        });
      } else {
        req.flash('success', 'Cadastro realizado com sucesso!');
        return res.redirect('/users/login');
      }
    } catch (err) {
      console.error("Erro ao registrar:", err);
      if (req.headers.accept?.includes('application/json')) {
        return res.status(500).json({ message: "Erro interno ao registrar usuário." });
      } else {
        req.flash('error', 'Erro ao registrar usuário');
        return res.redirect('/users/register');
      }
    }
  }

  // Página de login
  static loginPage(req, res) {
    if (req.headers.accept?.includes('application/json')) {
      return res.status(200).json({ message: "Rota de login de usuário ativa." });
    } else {
      return res.render('users/login');
    }
  }

  // Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await user.checkPassword(password))) {
        if (req.headers.accept?.includes('application/json')) {
          return res.status(401).json({ message: "E-mail ou senha inválidos." });
        } else {
          req.flash('error', 'E-mail ou senha inválidos');
          return res.redirect('/users/login');
        }
      }

      req.session.user = user;

      if (req.headers.accept?.includes('application/json')) {
        return res.status(200).json({
          message: "Login realizado com sucesso!",
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        });
      } else {
        req.flash('success', 'Login realizado com sucesso!');
        return res.redirect('/ideas');
      }
    } catch (err) {
      console.error("Erro no login:", err);
      return res.status(500).json({ message: "Erro interno ao fazer login." });
    }
  }

  // Logout
  static logout(req, res) {
    try {
      req.session.destroy(() => {
        if (req.headers.accept?.includes('application/json')) {
          return res.status(200).json({ message: "Logout realizado com sucesso!" });
        } else {
          return res.redirect('/users/login');
        }
      });
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
      return res.status(500).json({ message: "Erro interno ao realizar logout." });
    }
  }
}

module.exports = UserController;
