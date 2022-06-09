import passport from 'passport'
import LocalStrategy from 'passport-local'
import { getUserByEmail, getUserById, validatePassword } from '../models/users'

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => done(null, getUserById(id)))

const authenticateUser = (email, password, done) => {
  getUserByEmail(email)
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
