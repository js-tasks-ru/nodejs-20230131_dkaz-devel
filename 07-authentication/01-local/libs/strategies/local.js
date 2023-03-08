const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../../models/User')

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
        try {
            const user = await userModel.findOne({email})

            if (!user) {
                return done(null, false, 'Нет такого пользователя')
            }

            if (!(await user.checkPassword(password))) {
                return done(null, false, 'Неверный пароль')
            }

            return done(null, user);
        } catch (e) {
            done(e)
        }
    },
);
