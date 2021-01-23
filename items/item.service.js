const db = require('_helpers/db');

module.exports = {
    getAll,
    getItemById,
    create,
    update,
    updateItemImage,
    delete: _delete
};

async function getAll() {
    return await db.Item.findAll();
}

async function getItemById(id) {
    const item = await db.Item.findByPk(id);
    if (!item) throw 'Item not found';
    const user_id = item.user_id;
    const user = await db.User.findByPk(user_id);
    item.dataValues.user = user.dataValues;

    return item;
}

async function create(params) {
    return await db.Item.create(params);
}

async function update(id, params) {
    const item = await getItemById(id);
    Object.assign(item, params);
    return item.save();
}

async function updateItemImage(id, params) {
    const item = await getItemById(id);
    Object.assign(item, params);
    return item.save();
}

async function _delete(id) {
    const item = await getItemById(id);
    if (!item) throw 'Item not found';

    await item.destroy();
}