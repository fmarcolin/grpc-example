const User = require('./models/User');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = {
    async registerUser(call, callback) {
        const { email, username, password } = call.request.user;

        const user = await User.create({ email, username, password });

        user.id = user._id;

        return callback(null, { user });
    },

    async getUserById(call, callback) {
        const { id } = call.request;

        const user = await User.findById(id);

        user.id = user._id;

        return callback(null, { user: { ...user.toObject(), password: undefined } })
    },

    async loginUser(call, callback) {
        const { email, password } = call.request.user;

        const user = await User.findOne({ email });

        if (!user) {
            return callback(null, { error: 'User not found' });
        }

        if (!await user.compareHash(password)) {
            return callback(null, { error: 'Invalid password' });
        }

        user.id = user._id;

        return callback(null, {
            token: User.generateToken(user)
        })
    },

    async authenticate(call, callback) {
        var { token: fullToken } = call.request;

        if (!fullToken) {
            return callback(null, { error: 'No token provided' });
        }

        const parts = fullToken.split(' ');

        if (!parts.lenght === 2)
            return callback(null, { error: 'Token error' });

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme))
            return callback(null, { error: 'Token malformatted' });

        try {
            const decoded = await promisify(jwt.verify)(token, "test");

            const user = await User.findById(decoded.id)

            user.id = user._id;

            return callback(null, { user: { ...user.toObject(), password: undefined } })
        } catch (err) {
            return callback(null, { error: 'Token Invalid' });
        }
    }
}