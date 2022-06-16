import Link from 'next/link'
import Image from 'next/image'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import { useUser } from '../hooks/useUser'
import { useEffect } from 'react'

export default function Navigation() {
  const [user, { mutate }] = useUser()

  const logout = () => {
    fetch('api/auth/logout').then((res) => {
      mutate(undefined)
    })
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" collapseOnSelect>
      <Container className={'text-uppercase'}>
        <Link href="/" passHref>
          <Navbar.Brand>CardanoCars</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href="/" passHref>
              <Nav.Link>Overview</Nav.Link>
            </Link>
            {user && user.organizationId != null && (
              <Link href="/manage" passHref>
                <Nav.Link>Manage</Nav.Link>
              </Link>
            )}
            {user && user.admin && (
              <Link href="/admin" passHref>
                <Nav.Link>Admin</Nav.Link>
              </Link>
            )}
            {user && user.organizationId == 0 && (
              <Link href="/profile" passHref>
                <Nav.Link>Profile</Nav.Link>
              </Link>
            )}
            <Link href="/about" passHref>
              <Nav.Link>About</Nav.Link>
            </Link>
          </Nav>
          <Nav className={'align-items-lg-center'}>
            {!user && (
              <Link href="/login" passHref>
                <Button variant="outline-light">Login</Button>
              </Link>
            )}
            {user && (
              <Button variant="outline-light" onClick={logout}>
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
