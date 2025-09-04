/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function(done) {
  // Permissions cache
  global.cache = new Map();

  // Init permissions and roles
  const permCount = await Perm.count();
  const defaultPermissions  = require('./policies').defaultPermissions;
  const defaultRoles = require('./policies').defaultRoles;

  if (permCount === 0) {
    sails.log.info('Creating default permissions...');
    
    try {
      //console.log(defaultPermissions);
      await Perm.createEach(defaultPermissions);
      sails.log.info(`Successfully created ${defaultPermissions.length} default permissions`);
      
      await Role.createEach(defaultRoles);
      sails.log.info(`Successfully created ${defaultRoles.length} default roles`);

    } catch (error) {
      sails.log.error('Error creating default permissions:', error);
    }
  } else {
    sails.log.info(`Found ${permCount} existing permissions, skipping default creation`);
  }

  require('dotenv').config();
  return done();

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

};

