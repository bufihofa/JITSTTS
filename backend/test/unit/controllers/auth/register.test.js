const assert = require('assert');

const register = require('../../../../api/controllers/auth/register');

describe('- auth/register', () => {
    it("should success", async () => {
        const mockInputs = {
            username: `testuser_${Date.now()}`,
            email: `testuser_${Date.now()}@example.com`,
            password: 'Passw0rd!'
        };
        const result = {};

        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        }

        await register.fn(mockInputs, exits);
        assert.strictEqual(result.exit, 'success', `Expected exit 'success' but got '${result.exit}'`);
        assert.ok(result.data.token, 'Missing token in response data');
        assert.ok(result.data.user, 'Missing user in response data');

        await User.destroy({ id: result.data.user.id });
        
    });
    it("should fail on duplicate username/email", async () => {
        const existingUser = await User.create({
            username: `existinguser_${Date.now()}`,
            email: `existinguser_${Date.now()}@example.com`,
            password: 'Passw0rd!'
        }).fetch();

        const mockInputs = {
            username: existingUser.username,
            email: existingUser.email,
            password: 'AnotherPassw0rd!'    
        };

        const result = {};

        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        }

        await register.fn(mockInputs, exits);
        assert.strictEqual(result.exit, 'badRequest', `Expected exit 'badRequest' but got '${result.exit}'`);
        assert.ok(result.data.message.includes('đã tồn tại'), 'Expected duplicate error message');
        
        await User.destroy({ id: existingUser.id });
    });
    it("should fail on missing fields", async () => {
        const mockInputs = {
            username: '',
            email: 'invalidemail',
            password: ''
        };

        const result = {};

        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        }

        await register.fn(mockInputs, exits);
        assert.strictEqual(result.exit, 'badRequest', `Expected exit 'badRequest' but got '${result.exit}'`);
        assert.ok(result.data.message.includes('Không được bỏ trống thông tin'), 'Expected missing fields error message');
    });
    
    
});