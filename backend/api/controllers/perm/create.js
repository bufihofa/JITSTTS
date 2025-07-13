module.exports = {
  friendlyName: 'Create Perm',
  inputs: {
    name: { type: 'string', required: true },
    action: { type: 'string', required: true },
  },
  fn: async function (inputs, exits) {
    const { name, action } = inputs;

    const existingPerm = await Perm.findOne({ name });
    if (existingPerm) {
      return exits.success({ message: 'Permission already exists.', perm: existingPerm });
    }

    const newPerm = await Perm.create({ name, action }).fetch();
    
        

    return exits.success({ message: 'Permission created successfully.', perm: newPerm });
  },
};