import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { useState, useEffect } from 'react'
import Alert from 'react-bootstrap/Alert'
import Accordion from 'react-bootstrap/Accordion'
import { Formik } from 'formik'
import { useUser } from '../hooks/useUser'

export default function Admin() {
  const [user] = useUser()
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [organizations, setOrganizations] = useState([])
  const [users, setUsers] = useState([])

  const getOrganizations = async () => {
    const result = await fetch('/api/organizations')
    const data = await result.json()
    setOrganizations(data)
  }
  const getUsers = async () => {
    const result = await fetch('/api/users')
    const data = await result.json()
    setUsers(data)
  }

  useEffect(() => {
    getUsers()
    getOrganizations()
  }, [])

  if (!user?.admin) {
    return (
      <Container className={'w-75 mb-5'}>
        <Alert variant="danger" className="text-center">
          Unauthorized
        </Alert>
      </Container>
    )
  }

  return (
    <Container className={'w-75 mb-5'}>
      {errorMsg && <Alert variant="warning">{errorMsg}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Create a new organization</Accordion.Header>
          <Accordion.Body>
            <Formik
              onSubmit={(values, { resetForm }) => {
                fetch('/api/organizations/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(values),
                }).then(async (res) => {
                  if (res.status === 201) {
                    setErrorMsg('')
                    setSuccessMsg('New organization created')
                    setTimeout(() => setSuccessMsg(''), 3000)
                  } else {
                    setErrorMsg(await res.text())
                  }
                })
                resetForm()
              }}
              validate={(values) => {
                const errors = {}
                // name
                if (!values.name) {
                  errors.name = 'Required'
                } else if (values.name.length > 50) {
                  errors.name = 'Must be 50 characters or less'
                }
                // slug
                if (!values.slug) {
                  errors.slug = 'Required'
                } else if (values.slug.length > 15) {
                  errors.slug = 'Must be 15 characters or less'
                }
                // description
                if (!values.description) {
                  errors.description = 'Required'
                } else if (values.description.length > 200) {
                  errors.description = 'Must be 200 characters or less'
                }
                // type
                if (values.type == 'notype') {
                  errors.type = 'Choose a type'
                }

                return errors
              }}
              initialValues={{
                name: '',
                slug: '',
                description: '',
                type: 'notype',
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
                  {/* name */}
                  <Form.Group className={'mb-3'} controlId="name">
                    <Form.Label>Organization name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.name && errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {/* slug */}
                  <Form.Group className={'mb-3'} controlId="slug">
                    <Form.Label>Slug</Form.Label>
                    <Form.Control
                      type="text"
                      name="slug"
                      value={values.slug}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.slug && errors.slug}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.slug}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {/* description */}
                  <Form.Group className={'mb-3'} controlId="description">
                    <Form.Label>description</Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.description && errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {/* type */}
                  <Form.Group className={'mb-3'} controlId="type">
                    <Form.Label>type of organization</Form.Label>
                    <Form.Select
                      name="type"
                      value={values.type}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.type && errors.type}
                    >
                      <option value="notype">Select a type</option>
                      <option value="authority">Registration Authority</option>
                      <option value="manufacturer">Vehicle manufacturer</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.type}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Create
                  </Button>
                </Form>
              )}
            </Formik>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Set user as organization manager</Accordion.Header>
          <Accordion.Body>
            <Formik
              onSubmit={(values, { resetForm }) => {
                const userId = values.userId
                fetch(`/api/users/${userId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    organizationId: values.organizationId,
                  }),
                }).then(async (res) => {
                  if (res.status === 200) {
                    setErrorMsg('')
                    setSuccessMsg('User added successfully to organization')
                    setTimeout(() => setSuccessMsg(''), 3000)
                  } else {
                    setErrorMsg(await res.text())
                  }
                })
                resetForm()
              }}
              validate={(values) => {
                const errors = {}
                // organizationId
                if (values.organizationId == 'empty') {
                  errors.organizationId = 'Choose an organization'
                }
                // userId
                if (values.userId == 'empty') {
                  errors.userId = 'Choose a user'
                }
                return errors
              }}
              initialValues={{
                organizationId: 'empty',
                userId: 'empty',
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
                  {/* organizationId */}
                  <Form.Group className={'mb-3'} controlId="organizationId">
                    <Form.Label>Organization</Form.Label>
                    <Form.Select
                      name="organizationId"
                      value={values.organizationId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        touched.organizationId && errors.organizationId
                      }
                    >
                      <option value="empty">Select an organization</option>
                      {organizations &&
                        organizations.map((organization, i) => {
                          return (
                            <option key={i} value={organization.id}>
                              {organization.name}
                            </option>
                          )
                        })}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.organizationId}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {/* userId */}
                  <Form.Group className={'mb-3'} controlId="userId">
                    <Form.Label>User</Form.Label>
                    <Form.Select
                      name="userId"
                      value={values.userId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.userId && errors.userId}
                    >
                      <option value="empty">Select a user</option>
                      {users &&
                        users.map((user, i) => {
                          return (
                            <option key={i} value={user.id}>
                              {user.firstname} {user.lastname} | {user.email}
                            </option>
                          )
                        })}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.userId}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Add user to organization
                  </Button>
                </Form>
              )}
            </Formik>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  )
}
