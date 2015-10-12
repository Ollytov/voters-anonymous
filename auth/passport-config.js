module.exports = function() {
    var passport = require("passport");
    var LocalStrategy = require("passport-local").Strategy;
    var userServices = require("../services/user-services");
    var bcrypt = require("bcrypt");

    passport.use(new LocalStrategy(
        function(username, password, done) {
            userServices.findUser(username, function(err, user) {
                if (err) return done(null, null);
                if (!user) return done(null, null);
                bcrypt.compare(password, user.password, function(err, same) {
                    if (err) return done(err);
                    if (!same) return done(null, null);
                    done(null, user);
                });
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {
        userServices.findUser(username, function(err, user) {
            done(err, user);
        });
    });
}