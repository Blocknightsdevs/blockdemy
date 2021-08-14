import React, { useRef, useEffect, useState } from "react";
import { Player } from 'video-react';
import { Button,Input  } from 'react-bootstrap';
import ModalSale from './ModalSale';

function DisplayCourses({ courses,accounts }) {

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

  return courses.map((course) =>
    <div style={styleDiv}>

     {!isEmpty(courseOnSale) ? <ModalSale courseOnSale={courseOnSale} setCourseOnSale={setCourseOnSale} isEmpty={isEmpty} /> : <></>}

     <div>Course name: {course.title}</div><br></br>
     <div>Owner: {course.owner}</div><br></br>
     <div>Price: {course.price} USDT</div><br></br>
    {accounts && accounts[0]!=course.owner ?<Button>Buy Course</Button> : <Button onClick={() => setCourseOnSale(course) }>Edit</Button>}
    {course.uris.map((uri) => {
      return <Player src={"https://ipfs.infura.io/ipfs/"+uri}></Player>;
    })}
    </div>
  );
}

export default DisplayCourses;
