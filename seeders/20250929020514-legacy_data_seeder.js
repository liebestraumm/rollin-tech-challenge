'use strict';

const fs = require('fs').promises;
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      // Read the db.json file
      const dbPath = path.join(__dirname, '../src/database/legacy/db.json');
      const rawData = await fs.readFile(dbPath, 'utf8');
      const data = JSON.parse(rawData);

      // Transform the data to match our schema
      const tasks = data.tasks.map((task) => ({
        id: parseInt(task.id),
        created: new Date(task.created.split('/').reverse().join('-')), // Convert DD/MM/YYYY to YYYY-MM-DD
        title: task.title,
        description: task.description,
        complete: task.complete,
        due: new Date(task.due),
      }));

      return queryInterface.bulkInsert('tasks', tasks);
    } catch (error) {
      console.error('Seeding error:', error);
      throw error;
    }
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('tasks', null, {});
  },
};
