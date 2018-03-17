'use strict';

module.exports = function(app) {
  var menteeList = require('../controllers/controller');

  app.route('/mentees/:mentorId')
    .get(menteeList.list_all_mentees)
    .post(menteeList.create_a_mentee);


  app.route('/mentee/:mentorId')
    .get(menteeList.read_a_mentee)
    .put(menteeList.update_a_mentee)
    .delete(menteeList.delete_a_mentee);
};