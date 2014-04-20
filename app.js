
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var ObjectID = require('mongodb').ObjectID;

//New
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/nodetest2", {native_parser:true});

var app = express();

app.configure(function(){
	//Express Config
	//app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.session({secret: 'youhavekilledmyspirit'}));

	//Passport Config
	app.use(passport.initialize());
	app.use(passport.session());

	app.use(flash());

});

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('Actually Called');
    console.log(username);
    console.log(password);
    
    db.collection('userlist', function(error, collection){
      if(error){
      }
      else{
        collection.findOne(
          {'username': username},
          function(err, user){
            if(err){
              console.log('There was an error');
              return done(err);
            }
            if(!user){
              console.log("There is no user");
              return done(null, false);
            }
            if(!(user.password === password)){
              console.log("Password doesn't match?");
              return done(null, false);
            } 
            console.log('Guess this user is ok?');
            console.log(user);
            return done(null, user);
        });
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log('Serialized');
  done(null, user._id.toHexString());
});

passport.deserializeUser(function(id, done) {
  //User.findById(id, function(err, user) {
    //done(err, user);
  //});
  console.log('Deserialized');
  console.log(id);
  db.collection('userlist', function(error, collection){
    if(!error){
      collection.findOne({'_id': ObjectID.createFromHexString(id)}, function(err, user){
        if(err){
          console.log('ERROR');
          return done(err);
        }
        if(!user){
          console.log('User Not found');
          return done(null, false);
        }
        console.log('Found the User');
        return done(null, user);
      });
    }
    else {
      done(err);
    }
  })
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.userlist(db));

app.post('/adduser', user.adduser(db));

app.delete('/deleteuser/:id', user.deleteuser(db));

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/',
                                   failureFlash : 'Invalid username or password.', 
                                   successFlash : 'Welcome'})
);

app.get('/flash', function(req, res){
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash('info', 'Flash is back!')
  //res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
