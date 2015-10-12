var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var pollSchema = new Schema({
   title: {type: String, required: "Please Enter A Title"},
   category: {type: String},
   options: []
});

var Poll = mongoose.model("Poll", pollSchema);

module.exports = {Poll: Poll};