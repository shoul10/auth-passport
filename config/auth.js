// Access Control
module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('danger', 'Please log in to view that resource');
      res.redirect('/users/login');
    }
  };