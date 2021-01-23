const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    authenticate,
    getUser,
    create,
    authenticateUserById
};

async function authenticateUserById(id) {
    const token = jwt.sign({ sub: id }, config.secret, { expiresIn: '7d' });
    return { Authorization: token };
}

async function authenticate({ email, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.hash))) {
        throw {
            statusCode: 422,
            field: 'password',
            message: 'Wrong email or password'
        }
    }

    // authentication successful
    return authenticateUserById(user.id);
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw {
            field: 'email',
            message: 'Email "' + params.email + '" is already taken'
        }
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // save user
    return db.User.create(params);
}

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}