import { useEffect, useState } from 'react'
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import { useRouter } from 'next/router'
import { Formik } from 'formik'
import { useUser } from '../../../hooks/useUser'

export default function MintNFT() {
  const [user, { loading }] = useUser()
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const router = useRouter()
  const { policyId } = router.query

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }
  if (user?.organizationId == null) {
    return (
      <Container className={'w-75 mb-5'}>
        <Alert variant="danger" className="text-center">
          Unauthorized
        </Alert>
      </Container>
    )
  }

  const validate = (values) => {
    const errors = {}
    //VIN
    if (!values.vin) {
      errors.vin = 'Required'
    }
    //image
    if (!values.image) {
      errors.image = 'Required'
    }
    //brand
    if (!values.brand) {
      errors.brand = 'Required'
    }
    //version
    if (!values.version) {
      errors.version = 'Required'
    }
    //trade_name
    if (!values.trade_name) {
      errors.trade_name = 'Required'
    }
    //max_mass
    if (!values.max_mass) {
      errors.max_mass = 'Required'
    }
    //empty_mass
    if (!values.empty_mass) {
      errors.empty_mass = 'Required'
    }
    //vehicle_class
    if (!values.vehicle_class) {
      errors.vehicle_class = 'Required'
    }
    //color
    if (!values.color) {
      errors.color = 'Required'
    }
    return errors
  }

  const submitForm = (values) => {
    const formData = new FormData()
    formData.append('policyId', policyId)
    for (const key in values) {
      formData.append(key, values[key])
    }

    fetch('/api/nfts', {
      method: 'POST',
      body: formData,
    }).then(async (res) => {
      if (res.status === 201) {
        const json = await res.json()
        setErrorMsg('')
        setSuccessMsg(
          `Successfully minted a new NFT\nTransaction Hash: ${json.txHash}`
        )
        setTimeout(() => setSuccessMsg(''), 3000)
      } else {
        setErrorMsg(await res.text())
      }
    })
  }

  return (
    <>
      <Container className={'w-75 mb-5'}>
        <h2>Mint a new NFT</h2>
        {errorMsg && <Alert variant="warning">{errorMsg}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}
        <Formik
          initialValues={{
            vin: '',
            image: null,
            brand: '',
            version: '',
            trade_name: '',
            max_mass: '',
            empty_mass: '',
            vehicle_class: '',
            color: '',
          }}
          onSubmit={async (values, resetForm) => {
            submitForm(values)
            resetForm()
          }}
          validate={validate}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
            setFieldValue,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              {/* {errorMsg && <Alert variant="warning">{errorMsg}</Alert>} */}
              <Form.Group className={'mb-3'} controlId="vin">
                <Form.Label>Vehicle Identification Number (VIN)</Form.Label>
                <Form.Control
                  type="text"
                  name="vin"
                  value={values.vin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.vin && errors.vin}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.vin}
                </Form.Control.Feedback>
              </Form.Group>
              {/* image */}
              <Form.Group controlId="image" className="mb-3">
                <Form.Label>Select NFT Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={(event) => {
                    setFieldValue('image', event.currentTarget.files[0])
                  }}
                  onBlur={handleBlur}
                  isInvalid={touched.image && errors.image}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.image}
                </Form.Control.Feedback>
              </Form.Group>
              <hr />
              <div className={'fw-bold fs-5'}>Initial technical data</div>
              {/* brand */}
              <Form.Group className={'mb-3'} controlId="data">
                <Form.Label>D.1 - Vehicle brand</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={values.brand}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.brand && errors.brand}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.brand}
                </Form.Control.Feedback>
              </Form.Group>
              {/* version */}
              <Form.Group className={'mb-3'} controlId="data">
                <Form.Label>D.2 - Type/Variant/Version</Form.Label>
                <Form.Control
                  type="text"
                  name="version"
                  value={values.version}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.version && errors.version}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.version}
                </Form.Control.Feedback>
              </Form.Group>
              {/* trade_name */}
              <Form.Group className={'mb-3'} controlId="data">
                <Form.Label>D.3 - Trade name</Form.Label>
                <Form.Control
                  type="text"
                  name="trade_name"
                  value={values.trade_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.trade_name && errors.trade_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.trade_name}
                </Form.Control.Feedback>
              </Form.Group>
              {/* max_mass */}
              <Form.Group className={'mb-3'} controlId="data">
                <Form.Label>
                  F.1 - Technically permissible maximum mass in kg
                </Form.Label>
                <Form.Control
                  type="text"
                  name="max_mass"
                  value={values.max_mass}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.max_mass && errors.max_mass}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.max_mass}
                </Form.Control.Feedback>
              </Form.Group>
              {/* empty_mass */}
              <Form.Group className={'mb-3'} controlId="data">
                <Form.Label>
                  G - Mass of the vehicle in operation in kg (Empty mass)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="empty_mass"
                  value={values.empty_mass}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.empty_mass && errors.empty_mass}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.empty_mass}
                </Form.Control.Feedback>
              </Form.Group>
              {/* vehicle_class */}
              <Form.Group className={'mb-3'} controlId="data">
                <Form.Label>J - Vehicle class</Form.Label>
                <Form.Control
                  type="text"
                  name="vehicle_class"
                  value={values.vehicle_class}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.vehicle_class && errors.vehicle_class}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.vehicle_class}
                </Form.Control.Feedback>
              </Form.Group>
              {/* color */}
              <Form.Group className={'mb-3'} controlId="data">
                <Form.Label>R - Vehicle color</Form.Label>
                <Form.Control
                  type="text"
                  name="color"
                  value={values.color}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.color && errors.color}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.color}
                </Form.Control.Feedback>
              </Form.Group>

              <Row className="justify-content-center mt-3">
                <Col className="col-auto">
                  <Button
                    className={'px-5'}
                    variant="outline-dark"
                    type="submit"
                  >
                    Create
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  )
}
