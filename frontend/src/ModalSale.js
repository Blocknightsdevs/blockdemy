import React, { useRef, useEffect, useState } from "react";
import { Modal, Button, InputGroup, FormControl } from "react-bootstrap";

function ModalSale({ courseOnSale,setCourseOnSale,isEmpty,contract,accounts }) {

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

  const submit = async (e) => {
    e.preventDefault();
    await contract.methods
        .setOnSale(courseOnSale.id,courseOnSale.price)
        .send({ from: accounts[0] });
    handleClose();
    //should update state
    window.location.reload();
  };
  
  return (
      <Modal show={show} onHide={handleClose}>
        <form method="post" onSubmit={(e) => submit(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Put On Sale</Modal.Title>
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
