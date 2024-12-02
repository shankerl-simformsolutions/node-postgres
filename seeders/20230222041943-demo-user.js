'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:*/
    await queryInterface.bulkInsert('users', [{
        first_name: 'John',
        last_name: 'Doe',
        email: 'example@example.com',
        phone: '987456325',
        created_at: new Date(),
        updated_at: new Date()
    }], {});
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:*/
    await queryInterface.bulkDelete('users', null, {});
     
  }
};
