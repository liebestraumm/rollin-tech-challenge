'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('tasks', 'due', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('tasks', 'due', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }
};
