import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Formik } from 'formik'
import Form from 'react-bootstrap/Form'
import { useWallet } from '../hooks/useWallet'
import { useUser } from '../hooks/useUser'
import { useOrganization } from '../hooks/useOrganization'
import { useRef, useState } from 'react'
import AssetList from './AssetList'

const convertToAda = (lovelace) => {
  if (lovelace) {
    return lovelace / 1000000
  } else {
    return 0
  }
}

export default function WalletItem({ walletId }) {
  const { wallet, loading } = useWallet(walletId)
  const [user] = useUser()
  const { organization } = useOrganization(user?.organizationId)
  const [showModal, setShowModal] = useState(false)
  const formRef = useRef()
  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)

  const enableTransactions =
    user &&
    (user.walletId == wallet?.id || organization?.walletId == wallet?.id)

  const validate = (values) => {
    const errors = {}
    // address
    if (!values.address) {
      errors.address = 'Required'
    } else if (!values.address.startsWith('addr_')) {
      errors.address = 'Not a valid cardano address'
    }
    // amount
    if (!values.amount) {
      errors.amount = 'Required'
    } else if (values.amount > convertToAda(wallet.amount[0].quantity)) {
      errors.amount = `Insufficient balance. Max amount: ${convertToAda(
        wallet.amount[0].quantity
      )}`
    }

    return errors
  }

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit()
      if (formRef.current.isValid) {
        console.log('test')
      }
    }
  }

  if (loading) {
    return (
      <Container className="px-3 py-2 border mb-1 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }

  return (
    <>
      <Container className="align-items-center px-3 py-2 border mb-1">
        <Row className="align-items-center">
          <Link
            href="/wallets/[address]"
            as={`/wallets/${wallet.address}`}
            passHref
          >
            <Col className="col-3">{wallet.address}</Col>
          </Link>
          <Col></Col>
          <Col className="col-2 text-end fw-bold">
            {convertToAda(wallet.amount[0].quantity)} Ada
          </Col>
        </Row>
      </Container>
      <AssetList assets={wallet.amount} />
      {enableTransactions && (
        <Row className="justify-content-center mt-3">
          <Col className="col-auto">
            <Button variant="dark" className="px-4" onClick={handleShow}>
              Create Transaction
            </Button>
          </Col>
        </Row>
      )}

      {/* Confirmation request */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            innerRef={formRef}
            onSubmit={(values) => {
              console.log(values)
            }}
            validate={validate}
            initialValues={{ address: '', amount: '' }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                {/* address */}
                <Form.Group className={'mb-3'} controlId="address">
                  <Form.Label>Payment Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.address && errors.address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* amount */}
                <Form.Group className={'mb-3'} controlId="amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="amount"
                    placeholder="Ada"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.amount && errors.amount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.amount}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleSubmit()
              handleClose()
            }}
          >
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
