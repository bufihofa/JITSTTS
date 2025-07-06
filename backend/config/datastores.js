/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 *  > This file is mainly useful for configuring your development database,
 *  > as well as any additional one-off databases used by individual models.
 *  > Ready to go live?  Head towards `config/env/production.js`.
 *
 * For more information on configuring datastores, check out:
 * https://sailsjs.com/config/datastores
 */
require('dotenv').config();

const datastoreConfigs = {
  mysql: {
    adapter: 'sails-mysql',
    url: process.env.MYSQL_URI,
  },
  mongodb: {
    adapter: 'sails-mongo',
    url: process.env.MONGODB_URI,
    ssl: true,
    sslValidate: false,
  }
};

// Use DB_TYPE environment variable to determine which database to use
// Default to MySQL if not specified
const dbType = (process.env.DB_TYPE || 'mysql').toLowerCase();

module.exports.datastores = {
  default: datastoreConfigs[dbType] || datastoreConfigs.mysql,
};


