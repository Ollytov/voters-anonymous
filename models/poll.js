var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var pollSchema = new Schema({
   title: {type: String, required: "Please Enter A Title"},
   author: {type: String},
   category: {type: String},
   options: [],
   votes: [],
   date: {type: String}
});

var Poll = mongoose.model("Poll", pollSchema);

module.exports = {Poll: Poll};