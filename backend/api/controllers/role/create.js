module.exports = {
  friendlyName: 'Create Role',
  inputs: {
    name: { type: 'string', required: true },
    desc: { type: 'string', required: false },
  },
  fn: async function (inputs, exits) {
    const { name, desc } = inputs;

    if (!name) {
      return exits.badRequest({ message: 'Tên vai trò không được để trống.' });
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return exits.badRequest({ message: 'Vai trò đã tồn tại.' });
    }

    const newRole = await Role.create({ name, desc }).fetch();
    if (!newRole) {
      return exits.badRequest({ message: 'Tạo vai trò không thành công.' });
    }

    return exits.success({message: "Tạo Role thành công", role: newRole });
  }
}
