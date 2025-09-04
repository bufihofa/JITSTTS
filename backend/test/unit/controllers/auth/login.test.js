const assert = require('assert');

const login = require('../../../../api/controllers/auth/login');

describe('- auth/login', () => {
    it("should success", async () => {
        const existingUser = await User.create({
            username: `testuser_${Date.now()}`,
            email: `testuser_${Date.now()}@example.com`,
            password: 'Passw0rd!'
        }).fetch();
        const mockInputs = {
            username: existingUser.username,
            password: 'Passw0rd!'
        };
        
        const result = {};

        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        }

        await login.fn(mockInputs, exits);

        assert.strictEqual(result.exit, 'success', `Expected exit 'success' but got '${result.exit}'`);
        assert.ok(result.data.token, 'Missing token in response data');
        assert.ok(result.data.user, 'Missing user in response data');

        await User.destroy({ id: existingUser.id });
    });

    it("should fail on wrong password", async () => {
        const existingUser = await User.create({
            username: `testuser_${Date.now()}`,
            email: `testuser_${Date.now()}@example.com`,
            password: 'Passw0rd!'
        }).fetch();
        const mockInputs = {
            username: existingUser.username,
            password: 'WrongPassword!'
        };

        const result = {};

        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        }

        await login.fn(mockInputs, exits);

        assert.strictEqual(result.exit, 'badRequest', `Expected exit 'badRequest' but got '${result.exit}'`);
        assert.ok(result.data.message.includes('không thành công'), 'Expected login failure message');
        
        await User.destroy({ id: existingUser.id });
    });
    it("should fail on missing fields", async () => {
        const mockInputs = {
            username: '',
            password: ''
        };

        const result = {};

        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        }

        await login.fn(mockInputs, exits);

        assert.strictEqual(result.exit, 'badRequest', `Expected exit 'badRequest' but got '${result.exit}'`);
        assert.ok(result.data.message.includes('bắt buộc'), 'Expected missing fields error message');
    });
});