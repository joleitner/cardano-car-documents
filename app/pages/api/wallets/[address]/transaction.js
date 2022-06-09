import nextConnect from 'next-connect'
import auth from '../../../../middleware/auth'

const handler = nextConnect()

handler.use(auth).post(async (req, res) => {
  //todo
  res.json({ status: 111 })
})

export default handler
