import { useEffect, useState } from 'react'
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import { Formik } from 'formik'
import { useUser } from '../../hooks/useUser'

export default function CreateWallet() {
  const [user] = useUser()
  const [errorMsg, setErrorMsg] = useState('')

  //   if (!user?.admin) {
  //     return (
  //       <Container className={'w-75 mb-5'}>
  //         <Alert variant="danger" className="text-center">
  //           Unauthorized
  //         </Alert>
  //       </Container>
  //     )
  //   }

  const validate = (values) => {
    const errors = {}
    //VIN
    if (!values.vin) {
      errors.vin = 'Required'
    }
    //DATA
    if (!values.data) {
      errors.data = 'Required'
    }
    return errors
  }

  const submitForm = (values) => {
    fetch('/api/nft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    }).then(async (res) => {})
  }

  return (
    <>
      <Container className={'w-75 mb-5'}>
        <h2>Create a new NFT</h2>
        <Formik
          initialValues={{ vin: '' }}
          onSubmit={async (values) => {
            submitForm(values)
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
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              {errorMsg && <Alert variant="warning">{errorMsg}</Alert>}
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
              <Form.Group className={'mb-3'} controlId="vin">
                <Form.Label>Technische Daten</Form.Label>
                <Form.Control
                  type="text"
                  name="data"
                  value={values.data}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.data && errors.data}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.data}
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
