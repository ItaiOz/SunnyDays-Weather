var express = require('express');
var router = express.Router();

const db = require('../models'); //contain the Contact model, which is accessible via db.Contact

router.use(loggerFunc)

//middleware to check if we are registered or not
function loggerFunc(req,res,next){
    if (!req.session.isLoggedIn)
        res.render('login', {result: "All users have to log in first"})

    next()
}

//route for delete. we send the id number too
router.delete('/delete/:location', (req, res) => {

    return db.Locations.destroy( {      //were finding the right line by quering on user id and the location
        where: [{user_id: req.session.user_id}
        ,{location: req.params.location}]
    })
        .then((location) => {res.json(location)})       //returning if deleted or not
        .catch((err) => {
            console.log('There was an error deleting contacts', JSON.stringify(err))
            err.error = 1; // some error code for client side
            return res.send(err)
        });
});

//We use this route when we are pressing on the reset button on the program
router.delete('/reset', (req,res) =>{

            db.Locations.destroy({      //destroying each one in the table
            where: {},
            truncate: true})
            .then((loc) => {
                res.json(loc)})
            .catch((err) => {
            console.log('There was an error querying contacts', JSON.stringify(err))
            err.error = 1; // some error code for client side
            return res.send(err)
        });

});

//a get route to return the data in the table belongs to particular user
router.get('/resources', (req, res) =>{

    return db.Locations.findAll({where: {user_id: req.session.user_id}})
        .then((user) => res.json(user))
        .catch((err) => {
            console.log('There was an error querying contacts', JSON.stringify(err))
            return res.send(err)
        });
})

//A post route to receive data from the script file which includes the persons data
router.post('/add', (req, res) => {

    let location = req.body.name;
    let longitude = req.body.longitude;
    let latitude = req.body.latitude;
    let user_id = req.session.user_id;

    //creating a user from variables received from script file
    return db.Locations.create({ user_id, location, longitude, latitude })
        .then(() => res.json(location))
        .catch((err) => {
            console.log('***There was an error creating a contact', JSON.stringify(err))
            return res.status(400).send(err)
        })
});

//A get route to receive data when fetching from script
router.get('/add',(req,res)=>{
    res.redirect('/resources');
});

module.exports = router;
