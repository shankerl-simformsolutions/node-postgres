'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:*/
    await queryInterface.addColumn('users', 'password', { type: Sequelize.STRING, allowNull: false });
     
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example: */
    await queryInterface.removeColumn('users', 'password');
  }
};