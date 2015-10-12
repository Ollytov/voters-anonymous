var express = require('express');
var router = express.Router();
var userServices = require("../services/user-services");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/create', function(req, res, next) {
  res.render("users/create", {name: req.user ? req.user.firstname : null});
});

router.post("/create", function(req, res, next) {
    userServices.addUser(req.body, function(err, next) {
        if (err) {
            var vm = {
                title: "Create Account",
                input: req.body,
                error: err
            }
            delete vm.input.password;
            return res.render("users/create", vm);
        }
        res.redirect("/");
    });
});

module.exports = router;
