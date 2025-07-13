module.exports ={
    inputs: {
        show: { type: 'boolean', required: false, defaultsTo: false },
        config: { type: 'json', required: true },
    },
    friendlyName: 'Create PageConfig',
    fn: async function (inputs, exits) {
        try {
            
            const newSetting = await Setting.create({
                isShow: inputs.show,
                config: inputs.config
            }).fetch();

            return exits.success({ message: 'Setting created successfully.', setting: newSetting });
        } catch (error) {
            console.error('Error creating setting:', error);
            return exits.error({ message: 'An error occurred while creating the setting.' });
        }

    }
}


