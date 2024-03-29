
exports.postLogin = (req, res, next) => {
  ATOStopper.assertSafe({
    email: req.body.email,
    ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress
  }).then(() => {
    const validationErrors = [];
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
    if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' });

    if (validationErrors.length) {
      req.flash('errors', validationErrors);
      return res.redirect('/login');
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', info);
        return res.redirect('/login');
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        req.flash('success', { msg: 'Success! You are logged in.' });
        res.redirect(req.session.returnTo || '/');
      });
    })(req, res, next);
  }).catch((err) => {
    console.error(err);
    req.flash('errors', [{ msg: 'Invalid email or password.' }]);
    return res.redirect('/login');
  });
};
