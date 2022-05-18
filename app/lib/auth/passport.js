import passport from 'passport'
import LocalStrategy from 'passport-local'
import { findUserByEmail, findUserById, validatePassword } from '../user'

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => done(null, findUserById(id)))

const authenticateUser = (email, password, done) => {
  findUserByEmail(email)
    .then(async (user) => {
      if (user && (await validatePassword(user, password))) {
        done(null, user)
      } else {
        done(null, false, { message: 'Incorrect email or password.' })
      }
    })
    .catch((error) => done(error))
}

passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))

export default passport
