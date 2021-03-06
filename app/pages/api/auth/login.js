import nextConnect from 'next-connect'
import auth from '../../../middleware/auth'
import passport from 'passport'

const handler = nextConnect()

handler.use(auth).post(passport.authenticate('local'), (req, res) => {
  res.json(req.user)
})

export default handler
