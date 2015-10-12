var User = require("../models/user").User;
var Poll = require("../models/poll").Poll;
var Category = require("../models/category").Category;
var bcrypt = require("bcrypt");

module.exports.addUser = function(user, next) {
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) return next(err);
        var newUser = new User({
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            password: hash
        });
        newUser.save(function(err) {
            if (err) return next(err);
            next(null);
        });
    });
}

module.exports.findUser = function(username, next) {
    User.findOne({username: username}, function(err, user) {
        next(err, user);
    });
}

var groupOptions = function(options) {
    var arrList = [];
    for (var i = 0; i < options.length; i++) {
        if (options[i] !== "") {
            arrList.push(options[i]);   
        }
    }
    return arrList;
}

module.exports.addPoll = function(poll, next) {
    var newPoll = new Poll({
       title: poll.title,
       category: poll.category,
       options: groupOptions(poll.option)
    });
    newPoll.save(function(err) {
        if (err) return next(err);
        next(null);
    });
}

module.exports.addCategory = function(category, next) {
    var newCategory = new Category({
       category: category.title,
    });
    newCategory.save(function(err) {
        if (err) return next(err);
        next(null);
    });
}

module.exports.findCategory = function(category, next) {
    Category.findOne({category: category}, function(err, category) {
        next(err, category);
    });
}

module.exports.findCategories = function(next) {
    Category.find({}).exec(function(err, data) {
       if (err) return next(err); 
       next(err, data);
    });
}