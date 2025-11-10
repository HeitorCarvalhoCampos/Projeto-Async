module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Por favor, faça login para continuar.');
    res.redirect('/users/login');
  }
};
