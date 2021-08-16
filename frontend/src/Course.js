import React, { useRef, useEffect, useState } from "react";
import { InputGroup, FormControl, Button, Spinner } from "react-bootstrap";
import Web3 from "web3";
import ipfs from "./Utils/Ipfs";
import CourseActions from "./Utils/CourseActions";

function Course({ contract, accounts, courseAction, courseId,cData }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [buffers, setBuffers] = useState([]);
  const [paths, setPaths] = useState([]);
  const [saved, setSaved] = useState(false);
  const [laoding, setLoading] = useState(false);
  const [data,setData] = useState(null);


  useEffect(() => {
    if(data!=null && data.length>0){
      setTitle(data.title);
      setDescription(data.description);
      setPrice(Web3.utils.fromWei(data.price.toString()))
    }
  },[data]);

  useEffect(() => {
    setData(cData);
  },[]);


  useEffect(async () => {
    if (buffers.length > 0 && buffers.length == paths.length && !saved) {
      console.log('patths changed');
      if (courseAction == CourseActions.type_edit) {
        await saveEditDataToBlockchain();
      }else if(courseAction == CourseActions.type_create){
        await saveCreateDataToBlockchain();
      }
      setSaved(true);
      setLoading(false);
      window.location.reload();
    }
  }, [paths]);


  const saveEditDataToBlockchain = async () => {
    await contract.methods
    .editCourse(title, description, Web3.utils.toWei(price),paths, courseId)
    .send({ from: accounts[0] });
  }

  const saveCreateDataToBlockchain = async () => {
    await contract.methods
      .mintCourse(
        accounts[0],
        title,
        description,
        paths,
        Web3.utils.toWei(price)
      )
      .send({ from: accounts[0] });
  }

  const uploadFilesToipfs = async () => {
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
  }

  const saveCreateData = async () => {
     await uploadFilesToipfs();
  }

  const saveEditData = async () => {
      if(buffers.length > 0){
        await uploadFilesToipfs();
      }else{
        await contract.methods
          .editCourse(title, description, Web3.utils.toWei(price), courseId)
          .send({ from: accounts[0] });
          setSaved(true);
          setLoading(false);
          window.location.reload();
      }
  }

  const saveData = async (event) => {
    setLoading(true);
    event.preventDefault();
    
    if (courseAction == CourseActions.type_edit) {
      await saveEditData();
    }
    else if(courseAction == CourseActions.type_create){
      await saveCreateData();
   }
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

  return (
    <>
      {laoding ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <form
          method="post"
          encType="multipart/form-data"
          onSubmit={(e) => saveData(e)}
        >
          <h4>Course Form</h4>
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
            <InputGroup.Text id="basic-addon1">Description: </InputGroup.Text>
            <FormControl
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></FormControl>
          </InputGroup>
          <InputGroup>
            <InputGroup.Text id="basic-addon1"> Price (ETH): </InputGroup.Text>
            <FormControl
              type="number"
              step="0.0001"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></FormControl>
          </InputGroup>
          <InputGroup>
            <InputGroup.Text id="basic-addon1">
              Course Preview:{" "}
            </InputGroup.Text>
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
            Save course
          </Button>
        </form>
      )}
    </>
  );
}

export default Course;
