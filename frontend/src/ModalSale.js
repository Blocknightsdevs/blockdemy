import React, { useRef, useEffect, useState } from "react";
import { Modal, Button, InputGroup, FormControl } from "react-bootstrap";
import Web3 from "web3";

function ModalSale({
  courseOnSale,
  setCourseOnSale,
  isEmpty,
  contract,
  accounts,
}) {
  console.log(contract);
  const [show, setShow] = useState(!isEmpty(courseOnSale));
  const [price, setPrice] = useState(0);

  const handleClose = () => {
    setCourseOnSale({});
  };

  useEffect(() => {
    setShow(true);
  }, [courseOnSale]);

  useEffect(() => {
    if (courseOnSale.price > 0)
      setPrice(Web3.utils.fromWei(courseOnSale.price));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (price > 0) {
      await contract.methods
        .setOnSale(courseOnSale.id, Web3.utils.toWei(price))
        .send({ from: accounts[0] });
    }
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
              type="number"
              step="0.0001"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></FormControl>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            Confirm
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default ModalSale;
