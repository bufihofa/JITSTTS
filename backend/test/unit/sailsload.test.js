const { datastores } = require('../../config/datastores');

// Mocha bootstrap cho ORM-only
const Sails = require('sails').Sails;
let app;

before(function(done) {
  this.timeout(30000);

  app = new Sails();
  app.load(
    {
      environment: 'test',
      hooks: {
        http: false,
        sockets: false,
        blueprints: false,
        views: false, 
        grunt: false
      },
    models: { migrate: 'drop' },
    datastores: { 
      default: { 
        adapter: 'sails-disk'
      }
    },
    log: { level: 'error' },

      globals: { sails: true, models: true } 
    },
    (err) => {
      if (err) return done(err);
      done();
    }
  );
});

after((done) => app.lower(done));
