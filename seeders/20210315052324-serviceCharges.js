'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ServiceTypes', [{
      id: 1,
      name: 'Haircut',
      cost: 100,
      discountedCost: null,
      duration: 30,
      category: 'individual',
    },
    {
      id: 2,
      name: 'Shave',
      cost: 100,
      discountedCost: null,
      duration: 30,
      category: 'individual',
    },
    {
      id: 3,
      name: 'Head Massage',
      cost: 100,
      discountedCost: null,
      duration: 30,
      category: 'individual',
    },
    {
      id: 4,
      name: 'De tan',
      cost: 200,
      discountedCost: null,
      duration: 20,
      category: 'individual',
    },
    {
      id: 5,
      name: 'Scrub',
      cost: 250,
      discountedCost: null,
      duration: 30,
      category: 'individual',
    },
    {
      id: 6,
      name: 'Haircut/Shave/Hair wash/Scrub',
      cost: 600,
      discountedCost: 450,
      duration: 60,
      category: 'combo',
    },
    {
      id: 7,
      name: 'Haircut/Shave/De tan/Head Massage',
      cost: 880,
      discountedCost: 600,
      duration: 60,
      category: 'combo',
    },
    {
      id: 8,
      name: 'Head+Neck+Shoulder+Hands Massage',
      cost: 1150,
      discountedCost: 800,
      duration: 60,
      category: 'combo',
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ServiceTypes', null, {});
  }
};
