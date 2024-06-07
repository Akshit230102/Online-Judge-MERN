const mongoose = require('mongoose');

const problemSchema = mongoose.Schema({
  title:{
    type : String,
    default : null,
    required : true
  },

  description: {
    type : String,
    default : null,
    required : true
  },

  difficulty: {
    type : String,
    default : null,
    required : true,
  },

  solved: {
    type : String,
    default : null,
    required : true,
  },
  category: {
    type : String,
    default : null,
    required : true,
  }

});

module.exports = mongoose.model('Problem', problemSchema);
