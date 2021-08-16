import React, { useRef, useEffect, useState } from "react";
import { Player } from "video-react";
import { Button, Input } from "react-bootstrap";
import Web3 from "web3";
import {
  Redirect
} from "react-router-dom";

function DisplayCourses({ courses, accounts, bdemyContract }) {
  
  const [courseSelected, setCourseSelected] = useState(false);
 

  const buyCourse = async (course) => {
    await bdemyContract.methods
      .buyCourse(course.id)
      .send({ from: accounts[0], value: course.price });
    //should update state
    window.location.reload();
  };

  const getAllVideos = async (course) => {
    setCourseSelected(course);
  }

  return courses.map((course) => (
    <div key={course.id} className="shadow courseItem">

      <div>Course name: {course.title}</div>
      <br></br>
      <div>Owner: {course.owner}</div>
      <br></br>
      <div>Price: {Web3.utils.fromWei(course.price)} ETH</div>
      <br></br>
      {accounts && accounts[0] != course.owner && course.onSale ? (
        <Button onClick={() => buyCourse(course)}>Buy Course</Button>
      ) : (
        <></>
      )}
      <hr></hr>
      Course Visibility: {course.visibility}
      <Player src={"https://ipfs.infura.io/ipfs/" + course.videos_preview}></Player>
      <Button onClick={()=> getAllVideos(course)}>View Course</Button>
      {courseSelected ? 
        <Redirect to={'/videos/'+courseSelected.id}/>
        :<></>
      }
    </div>
  ));
}

export default DisplayCourses;
