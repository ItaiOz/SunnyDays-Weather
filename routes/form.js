var express = require('express');
var router = express.Router();

router.use(loggerFunc)

//middleware to check if we are registered or not
function loggerFunc(req,res,next){
    if (!req.session.isLoggedIn)
        res.redirect('/')

    next()
}

/* GET home page. display the FORM */
router.get('/web', function(req, res, next) {
    res.render('main', {result:"", gname: req.session.firstName});
});

router.post('/web', function(req, res, next) {
    res.render('main', {result:"", gname: req.session.firstName});
});





module.exports = router;