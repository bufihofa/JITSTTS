module.exports = {
    friendlyName: 'Delete Setting',
    inputs: {
        id: {
            description: 'The ID of the setting to delete.',
            type: 'string',
            required: true
        },
    },
    fn: async function (inputs, exits) {
        try {
            const currentSetting = await Setting.findOne({ id: inputs.id });
            if (!currentSetting) {
                return exits.error({ message: 'Setting not found.' });
            }
            await Setting.destroyOne({ id: inputs.id });

            return exits.success({ message: 'Setting deleted successfully.'});
        } catch (error) {
            console.error('Error', error);
            return exits.error({ message: 'An error' });
        }

    }
};