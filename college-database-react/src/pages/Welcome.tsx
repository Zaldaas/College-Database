import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Fade from 'react-bootstrap/Fade';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useState, useEffect } from 'react';

function Welcome() {
    useDocumentTitle('Welcome');

    const [show, setShow] = useState(false);

    useEffect(() => {
      // Trigger the fade-in animation after a short delay
      const timeout = setTimeout(() => {
        setShow(true);
      }, 100);
  
      return () => clearTimeout(timeout); // Clear timeout on unmount
    }, []);

    return (
    <>
      <Navbar className="bg-body-tertiary">

        <Nav className="ms-auto me-3">
          <Navbar.Brand href="/">Home</Navbar.Brand>
          <Nav.Link href="/about">About</Nav.Link>
          <Nav.Link href="/links">Links</Nav.Link>
        </Nav>
      </Navbar>
      <Fade in={show}>
      <div className="container text-center mt-5">
        <h1 className="mb-4">Welcome to the CSUF College Database!</h1>

        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <img src="/src/assets/CSUF.jpg" alt="CSUF" className="img-fluid mb-4" width="33%"/>
          <h3>Please login:</h3>
          <div className="mt-3">
            <Button href="/student" className="btn btn-primary me-2">
              Student
            </Button>
            <Button href="/professor" className="btn btn-primary me-2">
              Professor
            </Button>
            <Button href="/admin" className="btn btn-primary me-2">
              Administrator
            </Button>
          </div>
        </div>
      </div>
    </Fade>
  </>
  );
}


export default Welcome;
