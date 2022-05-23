import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useWallet } from '../hooks/useWallet'
import { useState } from 'react'


const convertToAda = (lovelace) => {
  if (lovelace) {
    return lovelace / 1000000
  } else {
    return 0
  }
} 


export default function WalletItem({walletName}) {
  const {wallet, loading} = useWallet(walletName)
  const [showModal, setShowModal] = useState(false)  
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const deleteWallet = () => {
    fetch(`/api/wallets`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name: wallet.name}),
    }).then(async (res) => {
      if (res.status == 200){
        const deleted = await res.json()
        if (deleted) {
          
          alert("success")
        }
      }else {
        console.log("error")
      }
    
    })
  
  }

  if(loading) {
    return (
      <Container className="px-3 py-2 border mb-1 text-center">
      <Spinner animation='border' role='status'>
        <span className="visually-hidden">Loading...</span>
        </Spinner>
        </Container>
    )
  }

  return (
    <>
     <Container className="align-items-center px-3 py-2 border mb-1">
         
      <Row className='align-items-center'>
        <Link
          href="/wallets/[name]"
          as={`/wallets/${wallet.name}`}
          passHref
        >
          <Col className='col-3'>
            <Badge bg='primary' className=''>{wallet.name}</Badge>
                
          </Col>
        </Link>
        <Col className='col-1 text-end'>{wallet.user.firstname}</Col>
        <Col className='col-3'>{wallet.user.lastname}</Col>
        <Col></Col>
        <Col className='col-2 text-end'>{convertToAda(wallet.balance.value.lovelace)} Ada</Col>
        <Col className='text-end col-2'>
         <Button variant='outline-danger' onClick={handleShow}>
          <i class="bi bi-trash-fill"></i>
        </Button>
        </Col>
      </Row>
      {/* <Row className='mt-2'>
        <Col className='fw-bold col-auto'>Address</Col>
        <Col className='text-break'>{wallet.paymentAddr}</Col>
      </Row> */}
     </Container>

      {/* Confirmation request */}
     <Modal show={showModal} onHide={handleClose}>
     <Modal.Header closeButton>
       <Modal.Title>Detele wallet</Modal.Title>
     </Modal.Header>
     <Modal.Body>Are you 100% sure you want to delete this wallet? All your assets in the wallet are gone forever! There is no way to restore access.</Modal.Body>
     <Modal.Footer>
       <Button variant="secondary" onClick={handleClose}>
         Cancel
       </Button>
       <Button variant="primary" onClick={() => {
         handleClose()
         deleteWallet()
         }}>
         Delete anyway
       </Button>
     </Modal.Footer>
   </Modal>
  </>
  )
}