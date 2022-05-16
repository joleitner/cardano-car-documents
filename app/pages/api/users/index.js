import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const result = await prisma.user.findMany()
    res.json({ res: result })
  } else if (req.method === 'POST') {
    const result = await prisma.user.create({
      data: {
        ...req.body,
      },
    })
    res.json(result)
  }
}
