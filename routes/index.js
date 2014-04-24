
/*
 * GET home page.
 */

exports.index = function(req, res){
  if(req.user) {
    console.log(req.user.fullname);
    res.render('index', { title: '[The Koalabook]', username: req.user.fullname });
  }
  else {
    res.render('index', { title: '[The Koalabook]', username: "" });
  }
};

