import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { Formik } from 'formik'
import Form from 'react-bootstrap/Form'
import { useRef, useState } from 'react'
import PolicyItem from './PolicyItem'
import { useOrganizationPolicies } from '../hooks/useOrganizationPolicies'
import { useOrganization } from '../hooks/useOrganization'

export default function PolicyList({ organizationId }) {
  const { policies, loading } = useOrganizationPolicies(organizationId)
  const { organization } = useOrganization(organizationId)
  const [showModal, setShowModal] = useState(false)
  const formRef = useRef()
  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)

  if (loading) {
    return (
      <Container className="px-3 py-2 border mb-1 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit()
    }
  }

  return (
    <>
      <Container className="p-0">
        {policies.map((policy, i) => (
          <PolicyItem key={i} policy={policy} number={i} />
        ))}
      </Container>
      <Row className="justify-content-center mt-3">
        <Col className="col-auto">
          <Button variant="dark" className="px-4" onClick={handleShow}>
            Create new policy
          </Button>
        </Col>
      </Row>
      {/* Create new policy */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create new policy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            innerRef={formRef}
            onSubmit={(values) => {
              fetch('/api/policies/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
              }).then(async (res) => {
                handleClose()
              })
            }}
            validate={(values) => {
              const errors = {}
              // name
              if (!values.name) {
                errors.name = 'Required'
              }

              return errors
            }}
            initialValues={{
              name: '',
              type: organization.type == 'authority' ? 'registration' : 'owner',
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
                  <Form.Label>Policy name</Form.Label>
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

                {/* type */}
                <Form.Group className={'mb-3'} controlId="amount">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={values.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.type && errors.type}
                    disabled
                  >
                    <option value="registration">Registration</option>
                    <option value="owner">Owner</option>
                  </Form.Select>
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
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
