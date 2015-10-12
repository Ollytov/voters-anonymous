var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userServices = require("../services/user-services");

var categorySchema = new Schema({
   category: {type: String, required: "Please Enter A Category"},
});

categorySchema.path("category").validate(function(value, next) {
    userServices.findCategory(value, function(err, category) {
        if (err) return next(err);
        next(!category);
    });
}, "That Category already exists!");

var Category = mongoose.model("Category", categorySchema);

module.exports = {Category: Category};