'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MenteeSchema = new Schema({
  name: {
    type: String,
    required: 'This mentee needs a name!'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [{
      type: String,
      enum: ['pending', 'figuring it out', 'certified baller']
    }],
    default: ['pending']
  }
},
{
  collection: "Mentees"
});

module.exports = mongoose.model('Mentee', MenteeSchema);