const isUserLoggedIn = (req, res, next) => {
  req.isAuthenticated() ? next() : res.redirect('/login');
};

const isUserAdmin = (req, res, next) => {
  req.isAuthenticated() && req.user.role === 'admin' ? next() : res.redirect('/dashboard');
};

module.exports = {
  isUserLoggedIn,
  isUserAdmin,
}