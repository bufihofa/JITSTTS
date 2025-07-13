module.exports = {
    friendlyName: 'Fetch Settings',
    fn: async function (inputs, exits) {
        try {
            const settings = await Setting.find();

            const perms = this.req.perms || [];
            return exits.success({ message: 'Settings retrieved successfully.', settings, perms });
        } catch (error) {
            console.error('Error fetching settings:', error);
            return exits.error({ message: 'An error occurred while fetching settings.' });
        }
    }
};