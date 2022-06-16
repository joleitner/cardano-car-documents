import Head from 'next/head'

export default function Meta({ title, keywords, description }) {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initital-scale=1" />
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <title>{title}</title>
    </Head>
  )
}

Meta.defaultProps = {
  title: 'Cardano Cars',
  keywords: 'nft, cardano, car, car registration',
  description: 'Car documents on cardano',
}
