import nextConnect from 'next-connect'
import auth from '../../../middleware/auth'

const handler = nextConnect()

handler.use(auth).get(async (req, res) => {
  res.json({ user: await req.user })
})

export default handler
