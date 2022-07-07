import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Toast from 'react-bootstrap/Toast'
import { Formik } from 'formik'
import Form from 'react-bootstrap/Form'
import { useWallet } from '../hooks/useWallet'
import { useRef, useState, useEffect } from 'react'

const convertToAda = (lovelace) => {
  if (lovelace) {
    return lovelace / 1000000
  } else {
    return 0
  }
}

export default function TransactionItem({ walletId }) {
  const { wallet, loading } = useWallet(walletId)
  const [showModal, setShowModal] = useState(false)
  const [assets, setAssets] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const formRef = useRef()

  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)

  const getWalletAssets = async () => {
    const result = await fetch(`/api/wallets/${walletId}/nfts`)
    const data = await result.json()
    setAssets(data)
  }
  useEffect(() => {
    if (wallet) {
      getWalletAssets()
    }
  }, [wallet])

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit()
    }
  }

  return (
    <>
      <Container className="d-flex justify-content-center mt-3">
        <Col className="col-auto">
          <Button variant="dark" className="px-4" onClick={handleShow}>
            Create Transaction
          </Button>
        </Col>
      </Container>

      {/* Confirmation request */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            innerRef={formRef}
            onSubmit={(values) => {
              if (values.assetId == 'empty') {
                delete values.assetId
              }
              fetch(`/api/wallets/${walletId}/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
              }).then(async (res) => {
                if (res.status == 200) {
                  let txInfo = await res.json()
                  let msg = (
                    <>
                      <div>
                        <span className="fw-bold">Transaction: </span>{' '}
                        <a
                          href={`https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=${txInfo.txHash}`}
                          target="_blank"
                        >
                          {txInfo.txHash}
                        </a>
                      </div>
                      <div>
                        <span className="fw-bold">Transaction Fee: </span>
                        {convertToAda(txInfo.fee)} Ada
                      </div>
                    </>
                  )
                  setToastMsg(msg)
                  setShowToast(true)
                }
                handleClose()
              })
            }}
            validate={(values) => {
              const errors = {}
              // receiver_address
              if (!values.receiver_address) {
                errors.receiver_address = 'Required'
              } else if (!values.receiver_address.startsWith('addr_')) {
                errors.receiver_address = 'Not a valid cardano address'
              }
              // amount
              if (!values.amount && values.assetId == 'empty') {
                errors.amount = 'Either a NFT or Ada required'
              }
              if (values.amount > convertToAda(wallet.amount[0].quantity)) {
                errors.amount = `Insufficient balance. Max amount: ${convertToAda(
                  wallet.amount[0].quantity
                )}`
              }
              // asset
              if (values.assetId == 'empty' && !values.amount) {
                errors.assetId = 'Either a NFT or Ada required'
              }
              if (values.asset != 'empty' && values.amount < 1.5) {
                errors.amount =
                  'Cardano requires you to send at least 1.5 Ada with a token transaction'
              }

              return errors
            }}
            initialValues={{
              receiver_address: '',
              amount: 0,
              assetId: 'empty',
            }}
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
                {/* receiver_address */}
                <Form.Group className={'mb-3'} controlId="receiver_address">
                  <Form.Label>Payment Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="receiver_address"
                    value={values.receiver_address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      touched.receiver_address && errors.receiver_address
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.receiver_address}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* amount */}
                <Form.Group className={'mb-3'} controlId="amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
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

                {/* assetId */}
                <Form.Group className={'mb-3'} controlId="amount">
                  <Form.Label>NFT</Form.Label>
                  <Form.Select
                    name="assetId"
                    value={values.assetId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.assetId && errors.assetId}
                    disabled={assets.length == 0}
                  >
                    <option value={'empty'}>Select NFT</option>
                    {assets &&
                      assets.map((asset, i) => {
                        return (
                          <option key={i} value={asset.asset}>
                            {asset.onchain_metadata.name}
                          </option>
                        )
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.assetId}
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
            }}
          >
            Send
          </Button>
        </Modal.Footer>
      </Modal>

      {/* transaction notification toast */}
      <Toast
        onClose={() => {
          setShowToast(false)
        }}
        show={showToast}
        style={{ position: 'fixed', bottom: 10, right: 10 }}
      >
        <Toast.Header>
          <strong className="me-auto">Transaction successfully created</strong>
        </Toast.Header>
        <Toast.Body>{toastMsg}</Toast.Body>
      </Toast>
    </>
  )
}
