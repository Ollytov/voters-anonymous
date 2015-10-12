var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userServices = require("../services/user-services");

var userSchema = new Schema({
   firstname: {type: String, required: "Please Enter Your First Name"},
   lastname: {type: String, required: "Please Enter Your Last Name"},
   username: {type: String, required: "Please Enter Your User Name"},
   email: {type: String, required: "Please Enter A Valid Email"},
   password: {type: String, required: "Please Enter A Password"}
});

userSchema.path("username").validate(function(value, next) {
    userServices.findUser(value, function(err, user) {
        if (err) return next(err);
        next(!user);
    });
}, "That Username is already in use!");

var User = mongoose.model("User", userSchema);
module.exports = {User: User};