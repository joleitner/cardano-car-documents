import Link from 'next/link'
import Image from 'next/image'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'

export default function Navigation() {

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" collapseOnSelect>
      <Container className={'text-uppercase'}>
        <Link href="/" passHref>
          <Navbar.Brand>
            CardanoCars
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href="/" passHref>
              <Nav.Link>Overview</Nav.Link>
            </Link>
            <Link href="/create" passHref>
              <Nav.Link>Create</Nav.Link>
            </Link>
            <Link href="/about" passHref>
              <Nav.Link>About</Nav.Link>
            </Link>
          </Nav>
          <Nav className={'align-items-lg-center'}>
  
              <Link href="/login" passHref>
                <Nav.Link>Login</Nav.Link>
                {/* <Button variant="outline-light">Login</Button> */}
              </Link>
            <Link href="/signup" passHref>
                <Nav.Link>Signup</Nav.Link>
              {/* <Button variant="outline-light">Signup</Button> */}
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}