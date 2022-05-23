import nextConnect from 'next-connect'
import auth from '../../../../middleware/auth'
import prisma from '../../../../lib/prisma'

const handler = nextConnect()

handler.use(auth).get(async (req, res) => {
  const { id } = req.query
  const user = await req.user
  if (user?.admin || user.id == id) {
    const reqUser = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        Wallet: true,
      },
    })

    let wallets = []
    reqUser.Wallet.forEach((element) => {
      wallets.push(element.name)
    })

    res.json(wallets)
  } else {
    res.json({ status: 401, message: 'Unauthorized' })
  }
})

export default handler
