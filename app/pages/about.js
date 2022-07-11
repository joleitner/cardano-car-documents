import Container from 'react-bootstrap/Container'

export default function About() {
  return (
    <Container className={'w-50 mb-5 text-center'}>
      <h3 className="mt-5">About</h3>
      <p>
        This is a prototype that is intended to test a concept that was
        developed as part of a bachelor thesis:
      </p>
      <p className="fw-bold mt-4 mb-1">
        Blockchain and NFTs - Meaningful use beyond cryptocurrencies?
      </p>
      <p>
        Conception and prototypical implementation of an NFT-based solution for
        the safekeeping of digital vehicle documents
      </p>
    </Container>
  )
}
