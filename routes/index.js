var express = require('express');
var router = express.Router();

const db = require('../models'); //contain the Contact model, which is accessible via db.Contact

/* GET home page. display the FORM */
router.get('/', function(req, res, next) {
  if(req.session.isLoggedIn)
      res.redirect('/web')
  else res.render('register', {result:""});
});

// this solution uses EJS to insert the result in the form page
// this is a POST request. If I had used GET, I would access to form data
// with req.query.first_number instead of req.body.first_number
router.post('/password', function(req, res, next) {

  req.session.firstName = req.body.first_name;          //initializing session details
  req.session.lastName = req.body.last_name;
  req.session.email = req.body.email;

  const email = req.body.email

      db.Users.findOne({            //if user is exist in system we redirecting back to home page
        where: {
          email: email
        }
      })
      .then((user) => {
        if(!user)
        {
          res.cookie('timer', 'true', { maxAge: 60 * 1000}); //initialize cookie for 60 secs
          res.render('setPassword', {first: req.session.firstName, msg: ""});
        }
        else{   //if user is exist in system we go back to main page with an error massage
          res.render('register', {result: "Email is already in use. Please register from another email"});
          res.redirect('/');
        }
      })

});

router.post('/login', function(req, res, next) {

  req.session.password = req.body.pass1;        //initializing session password in order to put in users table

  let counter = req.cookies.timer;              //checking if timer didnt time out

  if(!counter) res.redirect('/');           //if time is out we are redirecting to main page

  else {

      //making sure theres no collision with registering with two emails
      db.Users.findOne({
          where: {
              email: req.session.email
          }
      })
          .then((user) => {
              if (!user) {
                    //if not were creating the user
                  const {firstName, lastName, email, password} = req.session;
                  return db.Users.create({firstName, lastName, email, password})
                      .then(() => {
                          res.render('login', {result: ""})
                      })
                      .catch((err) => {
                          console.log('***There was an error creating a contact', JSON.stringify(err))
                          return res.status(400).send(err)
                      })

              } else {//if there is a collision we getting back to home page
                  res.render('register', {result: "Email is already in use. Please register from another email"})
                  res.redirect('/')
              }
          })
  }
});


router.post('/validateData', function(req, res, next) {

    //before entering to the main weather page we want to validate that user has inserted the right details
    let currMail = req.body.email;
    let currPass = req.body.pass;

    db.Users.findOne({
        where: {
            email: currMail,
            password: currPass
        }
    })
        .then((user) => {
            if (user) {
                req.session.user_id = user.id;      //important to initialize user id to add it to locations table
                req.session.firstName = user.firstName; //getting first name to present on the main screen
                req.session.isLoggedIn = true;
                res.redirect('/web');
            } else
                res.render('login', {result: "One of the Details is Wrong, register first or try again"});

        })


});
//----------------------------GET section--------------------------------
//I defined a get route if a user gets here if he presses enter. If he reaches here, he will be directed to one of the pages
router.get('/password', function(req, res, next) {
  if(req.session.isLoggedIn)
      res.redirect('/web')
  res.redirect('/');

});

router.get('/login', function(req, res, next) {
    if(req.session.isLoggedIn)
        req.session.isLoggedIn = false;
  res.render('login', {result: ""});
});

  module.exports = router;
