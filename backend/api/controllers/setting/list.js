module.exports = {
    friendlyName: 'List Settings',
    fn: async function (inputs, exits) {
        try {
            const settings = await Setting.find();

            if (!settings || settings.length === 0) {
                return exits.success({ message: 'No settings found.' });
            }

            return exits.success({ message: 'Settings retrieved successfully.', settings });
        } catch (error) {
            console.error('Error fetching settings:', error);
            return exits.error({ message: 'An error occurred while fetching settings.' });
        }
    }
};