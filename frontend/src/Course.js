import React, { useRef, useEffect, useState } from "react";
import { InputGroup, FormControl, Button,Spinner } from "react-bootstrap";
import Web3 from 'web3';

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

function Course({ contract, accounts }) {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [price, setPrice] = useState(null);
  const [onSale, setOnSale] = useState(null);
  const [buffers, setBuffers] = useState([]);
  const [paths, setPaths] = useState([]);
  const [saved, setSaved] = useState(false);
  const [laoding, setLoading] = useState(false);

  useEffect(() => {
    if (buffers.length > 0 && buffers.length == paths.length && !saved) {
      console.log(accounts[0], title, description, paths, Web3.utils.toWei(price));
      contract.methods
        .mintCourse(accounts[0], title, description, paths, Web3.utils.toWei(price))
        .send({ from: accounts[0] });

      setSaved(true);
      setLoading(false);
    }
  }, [paths]);

  const saveData = async (event) => {
    setLoading(true);
    event.preventDefault();

    await buffers.forEach(async (bufferElement) => {
      let res = await ipfs.add(bufferElement, async (error, result) => {
        console.log("Ipfs result", result);
        if (error) {
          console.error(error);
          return;
        }
        console.log(result[0].hash, description);
      });
      
      console.log(res);
      setPaths((paths) => [...paths, res.path]);
    });

  };

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      setBuffers((buffers) => [...buffers, Buffer(reader.result)]);
    };
  };

  return (
    <>
    {laoding ? 
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      :
      <form
        method="post"
        enctype="multipart/form-data"
        onSubmit={(e) => saveData(e)}
      >
        <InputGroup>
          {" "}
          <InputGroup.Text id="basic-addon1">Title: </InputGroup.Text>
          <FormControl
            type="text"
            name="title"
            onChange={(e) => setTitle(e.target.value)}
          ></FormControl>
        </InputGroup>
        <InputGroup>
          <InputGroup.Text id="basic-addon1">Description: </InputGroup.Text>
          <FormControl
            type="text"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
          ></FormControl>
        </InputGroup>
        <InputGroup>
          <InputGroup.Text id="basic-addon1"> Price (ETH): </InputGroup.Text>
          <FormControl
            type="number"
            step="0.0001"
            name="price"
            onChange={(e) => setPrice(e.target.value)}
          ></FormControl>
        </InputGroup>
        <InputGroup>
          <InputGroup.Text id="basic-addon1">File1: </InputGroup.Text>
          <FormControl
            type="file"
            name="file[]"
            multiple
            id="file"
            accept="video/mp4"
            onChange={(e) => captureFile(e)}
          />
          <InputGroup.Text id="basic-addon1">File2: </InputGroup.Text>
          <FormControl
            type="file"
            name="file[]"
            multiple
            id="file"
            accept="video/mp4"
            onChange={(e) => captureFile(e)}
          />
          <InputGroup.Text id="basic-addon1">File3: </InputGroup.Text>
          <FormControl
            type="file"
            name="file[]"
            multiple
            id="file"
            accept="video/mp4"
            onChange={(e) => captureFile(e)}
          />
        </InputGroup>
        <Button type="submit" name="ok">
          Send
        </Button>
      </form>
      }
    </>
  );
}

export default Course;
