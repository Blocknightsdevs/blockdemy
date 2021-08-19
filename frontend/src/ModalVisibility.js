import React, { useRef, useEffect, useState } from "react";
import { Modal, Button, InputGroup, FormControl, Alert } from "react-bootstrap";
import Web3 from "web3";

export default function ModalVisibility({course,setCourseToIncreaseVisibility,balance,bdemyContract,accounts,isEmpty}) {

  const [show, setShow] = useState(!isEmpty(course));
  const [amount, setAmount] = useState(0);
  const [balanceNotEnough, setBalanceNotEnough] = useState(false);

  useEffect(() => {
    console.log('modal visibility loaded ',course);
  }, []);

  useEffect(() => {
    setShow(true);
  }, [course]);

  const submit = async (e) => {
    e.preventDefault();
    
    if(parseInt(amount) <=  parseInt(Web3.utils.fromWei(balance))){
      await bdemyContract.methods
        .increaseVisibility(course.id, Web3.utils.toWei(amount))
        .send({ from: accounts[0] });
      window.location.reload();
      console.log('submit amount');
    }else{
      setBalanceNotEnough(true);
    }
  };

  const handleClose = () => {
    setCourseToIncreaseVisibility({});
  };


  return (
    <Modal show={show} onHide={handleClose}>
      <form method="post" onSubmit={(e) => submit(e)}>
        <Modal.Header closeButton>
          <Modal.Title>Increase Course Visibility</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          {balanceNotEnough && <Alert variant="danger " onClose={() => setBalanceNotEnough(false)} dismissible>Balance not enough</Alert>}
          <InputGroup>
            <InputGroup.Text id="basic-addon1">Current Balance: {Web3.utils.fromWei(balance)}</InputGroup.Text>
            <InputGroup.Text id="basic-addon1">Amount of BDEMY: </InputGroup.Text>
            <FormControl
              type="number"
              step="1"
              min="1"
              name="amount"
              onChange={(e) => setAmount(e.target.value)}
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