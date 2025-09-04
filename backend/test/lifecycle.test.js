const sails = require('sails');

before(function(done) {
  this.timeout(20000);

  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
  process.env.JWT_EXPIRATION = '7d';
  process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

  sails.lift(
    {
      hooks: { grunt: false },
      log: { level: 'error' },
      models: { migrate: 'drop' },
      datastores: { default: { adapter: 'sails-disk' } },
    },
    (err) => {
      if (err) return done(err);
      global.request = require('supertest')(sails.hooks.http.app);

      const USERNAME = 'itest_admin';
      const PASSWORD = 'Passw0rd!';
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

      (async () => {
        try {
          let loginRes = await global.request
            .post('/api/auth/login')
            .send({ username: USERNAME, password: PASSWORD });

          if (loginRes.status === 200 && loginRes.body && loginRes.body.token) {
            global.authToken = loginRes.body.token;
            return done();
          }

          const regRes = await global.request
            .post('/api/auth/register')
            .send({ username: USERNAME, email: ADMIN_EMAIL, password: PASSWORD })
            .expect(200);

          if (!regRes.body || !regRes.body.token) {
            return done(new Error('Missing token from register response'));
          }

          global.authToken = regRes.body.token;
          done();
        } catch (e) {
          done(e);
        }
      })();
    }
  );
});

after(function(done) {
  if (sails.lower) return sails.lower(done);
  done();
});