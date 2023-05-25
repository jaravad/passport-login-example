const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await getUserByEmail(email);
      if (!user) {
        return done(null, false, { message: 'No user with that email' })
      }
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch(e) {
      return done(e);
    }
  }
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => { 
    getUserById(id).then((user) => done(null, user));
    
  });
}

module.exports = initialize;