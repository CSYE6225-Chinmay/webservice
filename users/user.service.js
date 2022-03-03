const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const auth = require('basic-auth');

module.exports = {
    authenticate,
    basicauth,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function getAll() {
    return await db.User.findAll();

}

async function basicauth (req, res) {
    const x = auth(req);
    const uname = x.name;
    const user = await db.User.scope('withHash').findOne({ where: { username : uname } });
    if (!user || !(await bcrypt.compare(x.pass, user.hash)))
        return res.sendStatus(400);
    else {
        return { ...omitHash(user.get())};
    }
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    const salt = await bcrypt.genSalt(10);
    
    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, salt);
    }


    // save user
    await db.User.create(params);
    const user = await db.User.scope('withHash').findOne({ where: { username: params.username } });
    return { ...omitHash(user.get())};
}

async function update(req, res) {
    const x = auth(req);
    const uname = x.name;
    const user = await db.User.scope('withHash').findOne({ where: { username : uname } });
    console.log("1")
    if (!user || !(await bcrypt.compare(x.pass, user.hash)))
        return res.sendStatus(400);
    else {
        const usernameChanged = req.body.username && user.username !== req.body.username;
        if (usernameChanged && await db.User.findOne({ where: { username: req.body.username } })) {
            throw 'Username "' + req.body.username + '" is already taken';
        }
        console.log("2")
        // hash password if it was entered
        if (req.body.password) {
            req.body.hash = await bcrypt.hash(req.body.password, 10);
        }
        console.log("3")
        // copy params to user and save
        Object.assign(user, req.body);
        await user.save();
        console.log("4")
        return res.sendStatus(204);
    }

    //const user = await getUser(id);

    /* validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());*/
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}