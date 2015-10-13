var User = require("../models/user").User;
var Poll = require("../models/poll").Poll;
var Category = require("../models/category").Category;
var bcrypt = require("bcrypt");
var moment = require("moment");

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
       author: poll.author,
       category: poll.category,
       options: groupOptions(poll.option),
       votes: [],
       date: moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a')
    });
    newPoll.save(function(err) {
        if (err) return next(err);
        next(null);
    });
}

module.exports.getResults = function(id, next) {
    Poll.find({_id: id}).exec(function(err, data) {
        var voteData = [];
        if (err) return next(err);
        for (var i = 0; i < data[0].options.length; i++) {
            var numVotes = 0;
            for (var x = 0; x < data[0].votes.length; x++) {
                if (data[0].options[i] === data[0].votes[x]) {
                    numVotes++;
                }
            }
            voteData.push({
                value: numVotes,
                label: data[0].options[i]
            }); 
        }
        next(null, voteData);
        
    });
}

module.exports.addVote = function(id, option, next) {
    Poll.find({_id: id}).exec(function(err, data) {
        if (err) return next(err);
        Poll.findByIdAndUpdate(id, {$push: {votes: option.option}}, function(err, data) {
           if (err) return next(err);
           next(null);
        });
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

module.exports.findPolls = function(id, author, category, next) {
    if (id) {
        Poll.find({
            _id: id
        }).exec(function(err, data) {
            if (err) return next(err);
            next(err, data);
        })
    }
    else if (author) {
        Poll.find({
            author: author
        }).exec(function(err, data) {
            if (err) return next(err);
            next(err, data);
        })
    }
    else if (category) {
        Poll.find({
            category: category
        }).exec(function(err, data) {
            if (err) return next(err);
            next(err, data);
        })
    }
    else {
        Poll.find({}).exec(function(err, data) {
            if (err) return next(err);
            next(err, data);
        })
    }
}