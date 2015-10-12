var express = require('express');
var router = express.Router();
var passport = require("passport");
var restrict = require("../auth/restrict");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Voter's Anonymous", error: req.flash("error"), name: req.user ? req.user.firstname : null});
});

router.get("/dashboard", restrict, function(req, res, next) {
   res.render("dashboard/dashboard", {title: "Dashboard", name: req.user ? req.user.firstname : null}); 
});

router.get("/logout", function(req, res, next) {
   req.logout();
   res.redirect("/");
});

router.post("/", passport.authenticate("local", {successRedirect: "/dashboard", successFlash: "You have logged in.", failureRedirect: "/", failureFlash: "Invalid Credentials"}));


module.exports = router;
