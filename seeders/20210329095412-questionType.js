'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('QuestionTypes', [{
      id: 1,
      type_name: 'Long text answer',
    },
    {
      id: 2,
      type_name: 'Short text answer',
    },
    {
      id: 3,
      type_name: 'Multiple Choice',
    },
    {
      id: 4,
      type_name: 'Single Choice',
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('QuestionTypes', null, {});
  }
};