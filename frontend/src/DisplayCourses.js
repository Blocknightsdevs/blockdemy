import React, { useRef, useEffect, useState } from "react";
import { Player } from 'video-react';
import { Button,Input  } from 'react-bootstrap';
import ModalSale from './ModalSale';

function DisplayCourses({ courses,accounts,contract }) {

  const [courseOnSale, setCourseOnSale] = useState({});

  const styleDiv = {
      width: "100%",
      height: "auto",
      border: "1px solid black"

  };

  useEffect(() => {
    console.log(courseOnSale);
  },[courseOnSale]);

  const isEmpty = (obj) => {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        return false;
      }
    }
  
    return JSON.stringify(obj) === JSON.stringify({});
  }

  const notMoreOnSale = async (course) => {
    await contract.methods
    .notMoreOnSale(course.id)
    .send({ from: accounts[0] });
    //should update state
    window.location.reload();
  }

  return courses.map((course) =>
    <div style={styleDiv}>

     {!isEmpty(courseOnSale) ? <ModalSale accounts={accounts} contract={contract} courseOnSale={courseOnSale} setCourseOnSale={setCourseOnSale} isEmpty={isEmpty} /> : <></>}

     <div>Course name: {course.title}</div><br></br>
     <div>Owner: {course.owner}</div><br></br>
     <div>Price: {course.price} USDT</div><br></br>
     {accounts && accounts[0]!=course.owner && course.onSale ?
      <Button>Buy Course</Button> : 
      accounts && accounts[0]==course.owner && !course.onSale  ?
      <Button onClick={() => setCourseOnSale(course) }>Put On Sale</Button>:
      accounts && accounts[0]==course.owner && course.onSale  ?
      <Button onClick={() => notMoreOnSale(course)}>Not More On Sale</Button>
      :<></>}

    {course.uris.map((uri) => {
      return <Player src={"https://ipfs.infura.io/ipfs/"+uri}></Player>;
    })}
    </div>
  );
}

export default DisplayCourses;
