import React, { useRef, useEffect, useState } from "react";
import { Player } from "video-react";
import { Button, Input } from "react-bootstrap";
import ModalSale from "./ModalSale";
import Web3 from "web3";
import {
  Redirect
} from "react-router-dom";

function DisplayCourses({ courses, accounts, contract, bdemyContract,bdemyTokenContract }) {
  const [courseOnSale, setCourseOnSale] = useState({});
  const [courseSelected, setCourseSelected] = useState(false);
  const [balance, setBalance] = useState(0);


  useEffect(() => {

    const init = async () => {
      if(typeof bdemyTokenContract != 'undefined'){
        let balance = await bdemyTokenContract.methods.balanceOf(accounts[0]).call();
        console.log(balance,'balance!!!');
        setBalance(balance);
      }
    }
    init();
  },[bdemyTokenContract]);

  useEffect(() => {
    console.log(courseOnSale);
  }, [courseOnSale]);

  const isEmpty = (obj) => {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  };

  const increaseVisibility = async (course) => {

    await bdemyTokenContract.methods.approve(bdemyContract._address,Web3.utils.toWei("1000")).send({from:accounts[0]});

    await bdemyContract.methods.increaseVisibility(course.id,Web3.utils.toWei("1000")).send({ from: accounts[0] });
    //should update state
    window.location.reload();
  }

  const notMoreOnSale = async (course) => {
    await contract.methods.notMoreOnSale(course.id).send({ from: accounts[0] });
    //should update state
    window.location.reload();
  };

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
      {!isEmpty(courseOnSale) ? (
        <ModalSale
          accounts={accounts}
          contract={contract}
          courseOnSale={courseOnSale}
          setCourseOnSale={setCourseOnSale}
          isEmpty={isEmpty}
        />
      ) : (
        <></>
      )}

      <div>Course name: {course.title}</div>
      <br></br>
      <div>Owner: {course.owner}</div>
      <br></br>
      <div>Price: {Web3.utils.fromWei(course.price)} ETH</div>
      <br></br>
      {accounts && accounts[0] != course.owner && course.onSale ? (
        <Button onClick={() => buyCourse(course)}>Buy Course</Button>
      ) : accounts && accounts[0] == course.owner && !course.onSale ? (
        <Button onClick={() => setCourseOnSale(course)}>Put On Sale</Button>
      ) : accounts && accounts[0] == course.owner && course.onSale ? (
        <>
          <Button onClick={() => notMoreOnSale(course)}>Not More On Sale</Button>
          <Button disabled={balance==0} onClick={() => increaseVisibility(course)}>Increase Visibility</Button>
         
         
        </>
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
