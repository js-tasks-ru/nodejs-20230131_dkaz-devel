const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    class ValidationError extends Error {
        constructor(errors) {
            super()
            this.name = "ValidationError";
            this.errors = errors
        }
    }

    const errors = {};

    if (!ctx.request.body.password) {
        errors.password = {message: 'Пароль не передан'}
    }

    const token = uuid();

    const userData = {
        email: ctx.request.body.email,
        displayName: ctx.request.body.displayName,
        verificationToken: token,
    };

    const newUser = new User(userData);

    try {
        await newUser.setPassword(ctx.request.body.password);
    } catch (e) {
            if (!errors.password) errors.password = {message: e.message};
    }

    try {
        await newUser.save();
    } catch (e) {
        for (const field of Object.keys(e.errors)) {
            errors[field] = {message: e.errors[field].message};
        }
    }

    if (Object.keys(errors).length > 0) {
        throw new ValidationError(errors)
    }

    await sendMail({to: userData.email, template: 'confirmation', subject: 'Подтверждение регистрации', locals: {token: token}})

    ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
    const user = await User.findOne({verificationToken: ctx.request.body.verificationToken});

    if (!user) {
        ctx.throw(400, 'Ссылка подтверждения недействительна или устарела')
    }

    await user.updateOne({ $unset: { verificationToken: 1 } });

    const token = await ctx.login(user);

    ctx.body = {token};
};
