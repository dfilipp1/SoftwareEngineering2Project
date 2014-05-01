
/*
 * GET home page.
 */

exports.index = function(req, res){
  if(req.user) {
    console.log(req.user.fullname);
    res.render('index', { title: '[The Koalabook]', username: req.user.fullname, userName: req.user.username, password: req.user.password, SQ: req.user.securityQuestion, SQA: req.user.securityQuestionAnswer, picture: req.user.url, email: req.user.email, phone: req.user.phone, age: req.user.age, location: req.user.location, gender: req.user.gender, occupation: req.user.occupation, hobbies: req.user.hobbies });
  }
  else {
    res.render('index', { title: '[The Koalabook]', username: "" });
  }
};

