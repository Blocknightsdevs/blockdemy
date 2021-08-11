import React, { useRef, useEffect, useState } from "react";
import { Player } from 'video-react';
function DisplayCourses({ courses }) {

    const styleDiv = {
        width: "100%",
        height: "auto",
        border: "1px solid black"

    };
    

  return courses.map((course) =>
    <div style={styleDiv}>
     <div>Course name: {course.title}</div><br></br>
     <div>Owner: {course.owner}</div><br></br>
    {course.uris.map((uri) => {
      return <Player src={"https://ipfs.infura.io/ipfs/"+uri}></Player>;
    })}
    </div>
  );
}

export default DisplayCourses;
