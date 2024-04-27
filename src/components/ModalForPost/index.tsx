import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Example() {
  const [fullscreen, setFullscreen] = useState("sm-down");
  const [show, setShow] = useState(false);
  return (
    <>
      <Button onClick={()=>{
        setShow(true)
      }}>
        Show Modal
      </Button>
      <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>Modal body content</Modal.Body>
      </Modal>
    </>
  );
}

export default Example;