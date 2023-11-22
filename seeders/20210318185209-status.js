'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Statuses', [{
      id: 1,
      statusName: 'Pending',
    },
    {
      id: 2,
      statusName: 'Confirmed',
    },
    {
      id: 3,
      statusName: 'Not approved',
    },
    {
      id: 4,
      statusName: 'Cancelled',
    },
    {
      id: 5,
      statusName: 'Done',
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Statuses', null, {});
  }
};
