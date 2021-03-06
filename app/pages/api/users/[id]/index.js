import nextConnect from 'next-connect'
import auth from '../../../../middleware/auth'
import { getUserById, updateUser } from '../../../../src/models/users'

const handler = nextConnect()

handler
  .use(auth)
  .get(async (req, res) => {
    const { id } = req.query
    const user = await req.user

    if (user && (user.admin || user.id == id)) {
      const reqUser = await getUserById(id)
      delete reqUser.password
      res.json(reqUser)
    } else {
      res.json({ status: 401, message: 'Unauthorized' })
    }
  })
  .put(async (req, res) => {
    const { id } = req.query
    const user = await req.user
    if (user && (user.admin || user.id == id)) {
      // usually check body before updating!!
      let updatedUser = updateUser(id, req.body)
      res.json({ status: 200, updateUser })
    } else {
      res.json({ status: 401, message: 'Unauthorized' })
    }
  })

export default handler
