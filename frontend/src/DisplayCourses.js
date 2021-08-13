import React, { useRef, useEffect, useState } from "react";
import { Player } from 'video-react';
import { Button  } from 'react-bootstrap';
function DisplayCourses({ courses,accounts }) {


    const styleDiv = {
        width: "100%",
        height: "auto",
        border: "1px solid black"

    };

  return courses.map((course) =>
    <div style={styleDiv}>
     <div>Course name: {course.title}</div><br></br>
     <div>Owner: {course.owner}</div><br></br>
    {accounts && accounts[0]!=course.owner ?<Button>Buy Course</Button> : <Button>Sell Course</Button>}
    {course.uris.map((uri) => {
      return <Player src={"https://ipfs.infura.io/ipfs/"+uri}></Player>;
    })}
    </div>
  );
}

export default DisplayCourses;
