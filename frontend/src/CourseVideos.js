import React, { useEffect, useState } from "react";
import { InputGroup, FormControl, Button, Spinner } from "react-bootstrap";
import ipfs from "./Utils/Ipfs";

export default function CourseVideos({accounts,contract,courseId}) {


  const [buffers, setBuffers] = useState([]);
  const [paths, setPaths] = useState([]);
  const [saved, setSaved] = useState(false);
  const [laoding, setLoading] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(async () => {
    if (buffers.length > 0 && buffers.length == paths.length && !saved) {
        await contract.methods
        .editCourse(paths,[title],courseId)
        .send({ from: accounts[0] });
      setSaved(true);
      setLoading(false);
      window.location.reload();
    }
  }, [paths]);

  const uploadFilesToipfs = async () => {
    await buffers.forEach(async (bufferElement) => {
      let res = await ipfs.add(bufferElement, async (error, result) => {
        console.log("Ipfs result", result);
        if (error) {
          console.error(error);
          return;
        }
        console.log(result[0].hash);
      });

      console.log(res);
      setPaths((paths) => [...paths, res.path]);
    });
  };

  const captureFile = (event) => {
    event.preventDefault();
    setBuffers([]);
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      setBuffers((buffers) => [...buffers, Buffer(reader.result)]);
    };
  };

  const saveData = async (event) => {
    setLoading(true);
    event.preventDefault();
    await uploadFilesToipfs();
  };

  return (
    <>
      <h5>Add videos to the course </h5>
      {laoding ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
      <form method="post" encType="multipart/form-data" onSubmit={(e) => saveData(e)}>
        
        <InputGroup>
            {" "}
            <InputGroup.Text id="basic-addon1">Title: </InputGroup.Text>
            <FormControl
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></FormControl>
        </InputGroup>

        <InputGroup>
          <InputGroup.Text id="basic-addon1">add video: </InputGroup.Text>
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
          Upload
        </Button>
      </form>)}
    </>
  );
}
