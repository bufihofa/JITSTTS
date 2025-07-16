module.exports = {
    friendlyName: 'Update Setting',
    inputs: {
        id: {
            description: 'The ID of the setting to update.',
            type: 'string',
            required: true
        },
        show: { type: 'boolean', required: false, defaultsTo: false },
        config: { type: 'json', required: true },
    },
    fn: async function (inputs, exits) {
        try {
            
            const currentSetting = await Setting.findOne({ id: inputs.id });
            if (!currentSetting) {
                return exits.error({ message: 'Setting not found.' });
            }
            const updatedSetting = {
                show: inputs.show,
                config: inputs.config
            };
            const newSetting = await Setting.updateOne({ id: inputs.id }).set(updatedSetting).fetch();

            return exits.success({ message: 'Setting created successfully.', setting: newSetting });
        } catch (error) {
            console.error('Error creating setting:', error);
            return exits.error({ message: 'An error occurred while creating the setting.' });
        }

    }
};