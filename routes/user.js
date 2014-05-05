
/*
 * GET userlist page.
 */

exports.userlist = function(db) {
  return function(req, res) {
    db.collection('userlist').find().toArray(function(err, items) {res.json(items);})
  }
};

exports.adduser = function(db){
  return function(req, res){
    db.collection('userlist').insert(req.body, function(err, result) {
      res.send((err === null) ? {msg: ''} : {msg: err});
    });
  }
};

exports.deleteuser = function(db){
  return function(req, res) {
    var userToDelete = req.params.id;
    db.collection('userlist').removeById(userToDelete, function(err, result) {
      res.send((result === 1) ? {msg: ''} : {msg: err});
    });
  }
}

exports.updateuser = function(db){
  return function(req, res) {
    var newPassword = req.body.newPassword;
	var oldPassword = req.body.password;
	db.collection('userlist').update({password: oldPassword}, {$set: {password: newPassword}}, function(err, result){
      res.send((err === null) ? {msg: ''} : {msg: err});
    })
  }
};

exports.updateuserinformation = function(db){
  return function(req, res) {
    var currentPassword = req.body.password;
    var newFullName = req.body.newFullName;
	var newPicture = req.body.newPicture;
    var newPhone = req.body.newPhone;
	var newAge = req.body.newAge;
    var	newLocation = req.body.newLocation;
	var newGender = req.body.newGender;
	var newOccupation = req.body.newOccupation;
	var newHobbies = req.body.newHobbies;
	db.collection('userlist').update({password: currentPassword}, {$set: {fullname: newFullName, url: newPicture, phone: newPhone, age: newAge, location: newLocation, gender: newGender, occupation: newOccupation, hobbies: newHobbies}}, function(err, result){
      res.send((err === null) ? {msg: ''} : {msg: err});
    })
  }
};
