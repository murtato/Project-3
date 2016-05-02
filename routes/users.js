var express = require('express');
var router = express.Router();
// var photosCtrl = require('../controllers/photos')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// router.post('/photos', isLoggedIn, photosCtrl.create);

// router.delete('/photos', isLoggedIn, photosCtrl.delete);

// function isLoggedIn(req, res, next){
//   if(req.isAuthenticated() ) return next();
//   res.redirect('/auth/facebook?')
// }

// app.get('/auth/facebook',
//   passport.authenticate('facebook'));

// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });


module.exports = router;
