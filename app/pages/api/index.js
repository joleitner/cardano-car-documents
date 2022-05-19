// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res
    .status(200)
    .json({
      name: 'Cardano Cars Api',
      version: '1.0',
      description: 'Car documents digitalized on the Cardano Blockchain',
    })
}
