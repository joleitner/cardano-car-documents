import nextConnect from 'next-connect'
import auth from '../../../middleware/auth'
import { createUser, getUserByEmail } from '../../../lib/user'
import prisma from '../../../lib/prisma'

const handler = nextConnect()

handler
  .use(auth)
  .get(async (req, res) => {
    const result = await prisma.user.findMany()
    res.json(result)
  })

  .post(async (req, res) => {
    const { email, password, firstname, lastname } = req.body
    if (!email || !password || !firstname || !lastname) {
      return res.status(400).send('Missing fields')
    }
    // Here you check if the username has already been used
    const emailExisted = !!(await getUserByEmail(email))
    if (emailExisted) {
      return res
        .status(409)
        .send('An account with this email has already been created')
    }
    // Security-wise, you must hash the password before saving it
    // const hashedPass = await argon2.hash(password);
    // const user = { username, password: hashedPass, name }
    const user = await createUser(req.body)
    res.status(201).json({ user })
  })

export default handler
