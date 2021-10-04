const mongoose = require('mongoose');
const DrawSchema = new mongoose.Schema({
  frame:{
    type: String,
    required: true
  },
  data: {
    type: String,
    required: true
  },
  room:{
    type:String,
    required:true
  }
  
});
module.exports =mongoose.model('Draw', DrawSchema);