const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    id: String,
    email: String,
    username: String,
    password: String
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next();

    this.password = await bcrypt.hash(this.password, 8);
})

UserSchema.methods = {
    compareHash(hash) {
        return bcrypt.compare(hash, this.password)
    }
}

UserSchema.statics = {
    generateToken({ id }) {
        return jwt.sign({ id }, "test", {
            expiresIn: '7d'
        });
    }
}

module.exports = mongoose.model('User', UserSchema)