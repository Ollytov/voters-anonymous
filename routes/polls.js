var express = require('express');
var router = express.Router();
var userServices = require("../services/user-services");
var restrict = require("../auth/restrict");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/show/allpolls', function(req, res, next) {
  userServices.findPolls(null, null, null, function(err, data) {
      if (err) return next(err);
      res.render("polls/viewpolls", {title: "Recent Polls", name: req.user ? req.user.firstname : null, polls: data, username: req.user ? req.user.username : null});
  });
});

router.get("/show/:category", function(req, res, next) {
    userServices.findPolls(null, null, req.params.category, function(err, data) {
      if (err) return next(err);
      console.log(data);
      res.render("polls/viewpolls", {title: "Polls in " + req.params.category, name: req.user ? req.user.firstname : null, polls: data, username: req.user ? req.user.username : null});
    });
});

router.get("/createpoll", function(req, res, next) {
    userServices.findCategories(function(err, data) {
       if (err) return next(err); 
       res.render("polls/createpoll", {title: "Create Poll", name: req.user ? req.user.firstname : null, category: data, username: req.user ? req.user.username : null}); 
    });
});

router.get("/createcategory", restrict, function(req, res, next) {
   res.render("polls/createcategory", {title: "Create Category", name: req.user ? req.user.firstname : null, username: req.user ? req.user.username : null}); 
});

router.post("/createcategory", function(req, res, next) {
   userServices.addCategory(req.body, function(err, next) {
      if (err) {
          return res.render("polls/createcategory", {error: err});
      }
      req.flash("success", "You have successfully added a new category!");
      res.redirect("/dashboard");
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
        req.flash("success", "You have successfully created a new poll!");
        res.redirect("/dashboard");
    })
});

router.get("/find/:id", function(req, res, next) {
    userServices.findPolls(req.params.id, null, null, function(err, data) {
      if (err) return next(err);
      userServices.getResults(req.params.id, function(err, results) {
          console.log(results);
      });
      res.render("polls/poll", {title: data[0].title, name: req.user ? req.user.firstname : null, polls: data[0], username: req.user ? req.user.username : null});
    });
});

router.get("/results/:id", function(req, res, next) {
    userServices.findPolls(req.params.id, null, null, function(err, data) {
      if (err) return next(err);
      userServices.getResults(req.params.id, function(err, results) {
            if (err) return next(err);
            var chartData = [];
            for (var i = 0; i < results.length; i++) {
                chartData.push({
                    value: results[i].value,
                    color: "#F7464A",
                    highlight: "#FF5A5E",
                    label: results[i].label
                });
            }
            res.render("polls/pollresults", {title: data[0].title, name: req.user ? req.user.firstname : null, polls: data[0], username: req.user ? req.user.username : null, data: chartData, message: req.flash("success")});
      });
    });
    
});

router.get("/ajax/:id", function(req, res, next) {
    userServices.findPolls(req.params.id, null, null, function(err, data) {
      if (err) return next(err);
      userServices.getResults(req.params.id, function(err, results) {
            if (err) return next(err);
            var chartData = [];
            var colors = [
                "#B20C0C",      
                "#17257A",
                "#1D940A",
                "#500E77",
                "#B2690C"
            ];
            var highlights = [
                "#EF4949",      
                "#414FA4",
                "#4FC53D",
                "#7937A0",
                "#EFA649"
            ]
            var x = 0;
            for (var i = 0; i < results.length; i++) {
                if (x > 4) {
                    x = 0;
                }
                chartData.push({
                    value: results[i].value,
                    color: colors[x],
                    highlight: highlights[x],
                    label: results[i].label
                });
                x++;
            }
            res.send(chartData);
      });
    });
})

router.post("/find/:id", function(req, res, next) {
   userServices.addVote(req.params.id, req.body, function(err, next) {
      if (err) {
          res.render("/");
      }
      req.flash("success", "The poll has been updated with your vote!");
      res.redirect("/polls/results/"+req.params.id);
   });
});

module.exports = router;
