import React, { useRef, useEffect, useState } from "react";
import { Player } from "video-react";
import { Button, Alert } from "react-bootstrap";
import Web3 from "web3";

function DisplayCourses({ courses, accounts, bdemyContract }) {
  const buyCourse = async (course) => {
    await bdemyContract.methods
      .buyCourse(course.id)
      .send({ from: accounts[0], value: course.price });
    //should update state
    window.location.reload();
  };

  return courses.map((course) => (
    <div key={course.id} className="shadow courseItem">
      <div>Course name: {course.title}</div>
      <br></br>
      <div>Owner: {course.owner}</div>
      <br></br>
      <div>Price: {Web3.utils.fromWei(course.price)} ETH</div>
      <br></br>
      {accounts && accounts[0] != course.owner && course.onSale ? (
        <Button variant="success" onClick={() => buyCourse(course)}>
          Buy Course
        </Button>
      ) : accounts && accounts[0] != course.owner && !course.onSale ? (
        <Alert variant="warning">Course is not for sale</Alert>
      ) : (
        <></>
      )}
      <hr></hr>
      Course Visibility: {course.visibility}
      <Player
        src={"https://ipfs.infura.io/ipfs/" + course.videos_preview}
      ></Player>
    </div>
  ));
}

export default DisplayCourses;
