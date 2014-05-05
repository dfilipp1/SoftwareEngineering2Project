
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
    var userToUpdate = req.body.id;
	var newPassword = req.body.newPassword;
	var oldPassword = req.body.password;
	console.log('This is the User to update:');
	console.log(req.body.id);
	console.log('This is the new Password for the User:');
	console.log(newPassword);
	console.log('This is the old password:');
	console.log(oldPassword);
    db.collection('userlist').update({password: oldPassword}, {$set: {password: newPassword}}, function(err, result){
      res.send((err === null) ? {msg: ''} : {msg: err});
    })
  }
};

