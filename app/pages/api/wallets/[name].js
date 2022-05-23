import nextConnect from 'next-connect'
import WalletManager from '../../../lib/cardano/walletManager'
import prisma from '../../../lib/prisma'
import auth from '../../../middleware/auth'

const handler = nextConnect()
const walletManager = new WalletManager()

handler.use(auth).get(async (req, res) => {
  const { name } = req.query
  const { paymentAddr, stakingAddr } = walletManager.getWallet(name)
  const balance = walletManager.showBalance(name)

  const wallet = await prisma.wallet.findUnique({
    where: {
      name,
    },
    include: {
      User: true,
    },
  })
  let user = {}
  user.id = wallet.User.id

  const reqUser = await req.user
  if (reqUser?.admin) {
    user.firstname = wallet.User.firstname
    user.lastname = wallet.User.lastname
  }

  res.json({
    name,
    paymentAddr,
    stakingAddr,
    user,
    balance,
  })
})

export default handler
