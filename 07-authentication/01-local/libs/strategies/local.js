const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../../models/User')

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
        const user = await userModel.findOne({email: email})

        if (!user) {
            return done(null, null, 'Нет такого пользователя')
        }

        if (!(await user.checkPassword(password))) {
            return done(null, null, 'Неверный пароль')
        }

      return done(null, user);
    },
);
