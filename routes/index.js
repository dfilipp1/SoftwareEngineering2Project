
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log(req.session.passport.user);
  console.log(req.user);
  res.render('index', { title: '[The Koalabook]', username: req.session.passport.user });
};
