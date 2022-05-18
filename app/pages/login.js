import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Formik } from 'formik'
import { useUser } from '../hooks/useUser'

const Login = () => {
  const router = useRouter()
  const [user, { mutate }] = useUser()
  const [errorMsg, setErrorMsg] = useState('')

  const validate = (values) => {
    const errors = {}
    //email
    if (!values.email) {
      errors.email = 'Required'
    }
    //password
    if (!values.password) {
      errors.password = 'Required'
    }
    return errors
  }

  const submitForm = (values) => {
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    }).then(async (res) => {
      if (res.status === 200) {
        const userObj = await res.json()
        mutate(userObj)
      } else {
        setErrorMsg('Incorrect email or password')
      }
    })
  }

  useEffect(() => {
    if (user) router.push('/') // redirect to home if user is authenticated
  }, [user])

  return (
    <Container className={'w-50 mb-5'}>
      <h2>Login</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
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
            <Form.Group className={'mb-3'} controlId="email">
              <Form.Label>E-Mail</Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.email && errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className={'mb-3'} controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.password && errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default Login
