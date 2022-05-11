import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { Formik } from 'formik'
import { useRouter } from 'next/router'

const validate = (values) => {
  const errors = {}
  // account
  if (!values.account) {
    errors.account = 'Required'
  } else if (values.account.length > 50) {
    errors.account = 'Must be 50 characters or less'
  }

  return errors
}

export default function CreateWallet() {
  return (
    <Container className={'w-75 mb-5'}>
      <h2>Create a new wallet</h2>
      <Formik
        onSubmit={(values) => {
          fetch(`api/wallet`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ account: values.account }),
          }).then((res) => console.log(res.json()))
        }}
        validate={validate}
        initialValues={{ account: '' }}
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
            {/* account */}
            <Form.Group className={'mb-3'} controlId="name">
              <Form.Label>Wallet name</Form.Label>
              <Form.Control
                type="text"
                name="account"
                value={values.account}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.title && errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.account}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  )
}
