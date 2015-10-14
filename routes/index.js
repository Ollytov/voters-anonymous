var express = require('express');
var router = express.Router();
var passport = require("passport");
var restrict = require("../auth/restrict");
var userServices = require("../services/user-services");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Voter's Anonymous", name: req.user ? req.user.firstname : null, username: req.user ? req.user.username : null, messageSuccess: req.flash("success"), error: req.flash("error")});
});

router.get("/dashboard", restrict, function(req, res, next) {
   res.render("dashboard/dashboard", {title: "Dashboard", name: req.user ? req.user.firstname : null, username: req.user ? req.user.username : null, message: req.flash("success")}); 
});

router.get("/logout", function(req, res, next) {
   req.logout();
   res.redirect("/");
});

router.post("/login", passport.authenticate("local", {successRedirect: "/dashboard", successFlash: "You have successfully logged in.", failureRedirect: "/", failureFlash: "Invalid Credentials!"}));

router.post("/dashboard", function(req, res, next) {
   console.log(req.body);
   userServices.searchUser(req.body.searchfield, function(err, next) {
       if (err) return next(err);
       res.redirect("/users/polls/"+req.body.searchfield);
   }) 
});

module.exports = router;
