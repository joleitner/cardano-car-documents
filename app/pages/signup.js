import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Formik } from 'formik'

const Signup = () => {
  const router = useRouter()
  const [user] = useUser()
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const validate = (values) => {
    const errors = {}
    //firstname
    if (!values.firstname) {
      errors.firstname = 'Required'
    }
    //lastname
    if (!values.lastname) {
      errors.lastname = 'Required'
    }
    //email
    if (!values.email) {
      errors.email = 'Required'
    }
    //password
    if (!values.password) {
      errors.password = 'Required'
    }
    //rpassword
    if (!values.rpassword) {
      errors.rpassword = 'Required'
    } else if (values.password !== values.rpassword) {
      errors.rpassword = "Passwords don't match up"
    }
    return errors
  }

  const submitForm = (values) => {
    fetch('/api/users/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    }).then(async (res) => {
      if (res.status === 201) {
        setErrorMsg('')
        setSuccessMsg('You have successfully registered')
        setTimeout(() => router.push('/login'), 1000)
      } else {
        setErrorMsg(await res.text())
      }
    })
  }

  useEffect(() => {
    if (user) router.push('/') // redirect to home if user is authenticated
  }, [user])

  return (
    <Container className={'w-50 mb-5'}>
      <h2>Signup</h2>
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          rpassword: '',
        }}
        onSubmit={(values, { resetForm }) => {
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
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            {errorMsg && <Alert variant="warning">{errorMsg}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            <Form.Group className={'mb-3'} controlId="firstname">
              <Form.Label>Firstname</Form.Label>
              <Form.Control
                type="text"
                name="firstname"
                value={values.firstname}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.firstname && errors.firstname}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstname}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className={'mb-3'} controlId="lastname">
              <Form.Label>Lastname</Form.Label>
              <Form.Control
                type="text"
                name="lastname"
                value={values.lastname}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.lastname && errors.lastname}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastname}
              </Form.Control.Feedback>
            </Form.Group>
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
            <Form.Group className={'mb-3'} controlId="rpassword">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control
                type="password"
                name="rpassword"
                value={values.rpassword}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.rpassword && errors.rpassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.rpassword}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="mb-3 link-primary">
              <Link href="/login" passHref>
                You already have an account?
              </Link>
            </div>
            <Button variant="primary" type="submit">
              Signup
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default Signup
