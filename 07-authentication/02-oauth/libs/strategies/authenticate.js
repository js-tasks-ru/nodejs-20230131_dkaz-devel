const userModel = require('../../models/User')

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if (!email) {
      return done(null, false, 'Не указан email');
    }

    const user = await userModel.findOne({email});

    if (!user) {
      const newUser = new userModel({email, displayName});
      await newUser.save();

      return done(null, newUser);
    }

    return done(null, user);
  } catch (e) {
    done(e);
  }
};
