import React, { useRef, useEffect, useState } from "react";
import { Modal, Button, InputGroup, FormControl } from "react-bootstrap";

function ModalSale({ courseOnSale,setCourseOnSale,isEmpty }) {

  const [show,setShow] = useState(!isEmpty(courseOnSale));
  
  const handleClose = () => {
    setCourseOnSale({});
    
  }

  useEffect(() => {
    setShow(true);
  },[courseOnSale]);

  useEffect(() => {
    console.log(courseOnSale);
  },[]);

  const submit = (e) => {
    e.preventDefault();
    console.log(courseOnSale);
    handleClose();
  };
  
  return (
      <Modal show={show} onHide={handleClose}>
        <form method="post" onSubmit={(e) => submit(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Change sale details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {" "}
            <InputGroup>
              <InputGroup.Text id="basic-addon1">Price: </InputGroup.Text>
              <FormControl
                type="text"
                name="price"
                value={courseOnSale.price}
                onChange={(e) => setCourseOnSale({...courseOnSale,price:e.target.value})}
              ></FormControl>
              <InputGroup.Text id="basic-addon1">OnSale: </InputGroup.Text>
                <InputGroup.Checkbox
                type="checkbox"
                name="onSale"
                value={courseOnSale.onSale}
                onChange={(e) =>  setCourseOnSale({...courseOnSale,onSale:e.target.checked})}
                ></InputGroup.Checkbox>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
  );
}

export default ModalSale;
