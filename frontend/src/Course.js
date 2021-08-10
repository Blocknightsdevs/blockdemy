import React, { useRef, useEffect, useState } from "react";
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
  const [buffer, setBuffer] = useState([]);

  const saveData = async (event) => {
    event.preventDefault();

 
    let res = await ipfs.add(buffer, async (error, result) => {
      console.log("Ipfs result", result);
      if (error) {
        console.error(error);
        return;
      }
      console.log(result[0].hash, description);
    });
    
    contract.methods
        .mintCourse(
          accounts[0],
          title,
          description,
          [res.path],
          price,
          onSale
        )
        .send({from: accounts[0]});
  };

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
      console.log("buffer", buffer);
    };
  };

  return (
    <form
      method="post"
      enctype="multipart/form-data"
      onSubmit={(e) => saveData(e)}
    >
      Title:{" "}
      <input
        type="text"
        name="title"
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      Description:{" "}
      <input
        type="text"
        name="description"
        onChange={(e) => setDescription(e.target.value)}
      ></input>
      Price:{" "}
      <input
        type="number"
        name="price"
        onChange={(e) => setPrice(e.target.value)}
      ></input>
      OnSale:{" "}
      <input
        type="checkbox"
        name="onSale"
        onChange={(e) => setOnSale(e.target.checked)}
      ></input>
      File:{" "}
      <input
        type="file"
        name="file"
        multiple
        id="file"
        onChange={(e) => captureFile(e)}
      />
      <input type="submit" name="ok" />
    </form>
  );
}

export default Course;
