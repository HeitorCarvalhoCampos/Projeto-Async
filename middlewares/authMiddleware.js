module.exports = {
    isLoggedIn(req, res, next) {
      if (!req.session.user) {
        req.flash('error', 'Você precisa estar logado para acessar esta página');
        return res.redirect('/users/login');
      }
      next();
    },
  };
  