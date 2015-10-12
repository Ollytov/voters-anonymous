var express = require('express');
var router = express.Router();
var userServices = require("../services/user-services");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/createpoll", function(req, res, next) {
    userServices.findCategories(function(err, data) {
       if (err) return next(err); 
       res.render("polls/createpoll", {title: "Create Poll", name: req.user ? req.user.firstname : null, category: data}); 
    });
});

router.get("/createcategory", function(req, res, next) {
   res.render("polls/createcategory", {title: "Create Category", name: req.user ? req.user.firstname : null}); 
});

router.post("/createcategory", function(req, res, next) {
   userServices.addCategory(req.body, function(err, next) {
      if (err) {
          return res.render("polls/createcategory", {error: err});
      }
      res.redirect("dashboard/dashboard");
   });
});

router.post("/createpoll", function(req, res, next) {
    userServices.addPoll(req.body, function(err, next) {
        console.log(req.body);
        if (err) {
            var vm = {
                title: "Create Poll",
                input: req.body,
                error: err
            }
            return res.render("polls/createpoll", vm);
        }
        res.redirect("/");
    })
});

module.exports = router;
