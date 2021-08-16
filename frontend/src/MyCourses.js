import React, { useEffect, useState } from "react";
import Course from "./Course";
import Web3 from "web3";
import { Button, Input } from "react-bootstrap";
import ModalSale from "./ModalSale";
import { Player } from "video-react";
import {
    Redirect
  } from "react-router-dom";

export default function MyCourses({ contract, accounts, mycourses,bdemyTokenContract,bdemyContract }) {
  const [courseOnSale, setCourseOnSale] = useState({});
  const [balance, setBalance] = useState(0);
  const [courseSelected, setCourseSelected] = useState(false);

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

  const isEmpty = (obj) => {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  };

  const increaseVisibility = async (course) => {
    //he must tell the amount between 0 and balance
    await bdemyTokenContract.methods
      .approve(bdemyContract._address, Web3.utils.toWei("1000"))
      .send({ from: accounts[0] });

    await bdemyContract.methods
      .increaseVisibility(course.id, Web3.utils.toWei("1000"))
      .send({ from: accounts[0] });
    //should update state
    window.location.reload();
  };

  const notMoreOnSale = async (course) => {
    await contract.methods.notMoreOnSale(course.id).send({ from: accounts[0] });
    //should update state
    window.location.reload();
  };

  const getAllVideos = async (course) => {
    setCourseSelected(course);
  }
  return (
    <>
      <h1>Blockdemy - My courses</h1>
      <Course contract={contract} accounts={accounts}></Course>
      {mycourses.map((course) => (
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
          {accounts && accounts[0] == course.owner && !course.onSale ? (
            <Button onClick={() => setCourseOnSale(course)}>Put On Sale</Button>
          ) : accounts && accounts[0] == course.owner && course.onSale ? (
            <>
              <Button onClick={() => notMoreOnSale(course)}>
                Not More On Sale
              </Button>
              <Button
                disabled={balance == 0}
                onClick={() => increaseVisibility(course)}
              >
                Increase Visibility
              </Button>
            </>
          ) : (<></>)}

            Course Visibility: {course.visibility}
            <Player src={"https://ipfs.infura.io/ipfs/" + course.videos_preview}></Player>
            <Button onClick={()=> getAllVideos(course)}>View Course</Button>
            <Button onClick={()=> alert('edit course '+course.id)}>Edit Course</Button>
            {courseSelected ? 
                <Redirect to={'/videos/'+courseSelected.id}/>
                :<></>
            }

        </div>
      ))}
    </>
  );
}
