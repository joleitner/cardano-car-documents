import nextConnect from 'next-connect'
import auth from '../../../middleware/auth'

const handler = nextConnect()

handler.use(auth).get((req, res) => {
  req.logout()
  res.status(204).end()
})

export default handler
