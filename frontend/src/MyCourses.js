import React, { useEffect, useState } from "react";
import Course from "./Course";
import Web3 from "web3";
import { Button, Input } from "react-bootstrap";
import ModalSale from "./ModalSale";
import { Player } from "video-react";
import { Redirect } from "react-router-dom";
import CourseActions from "./Utils/CourseActions";

export default function MyCourses({
  contract,
  accounts,
  mycourses,
  bdemyTokenContract,
  bdemyContract,
}) {
  const [courseOnSale, setCourseOnSale] = useState({});
  const [balance, setBalance] = useState(0);
  const [goToVideos, setGoTovideos] = useState(false);
  const [goToEdition, setGoToEdition] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof bdemyTokenContract != "undefined") {
        let balance = await bdemyTokenContract.methods
          .balanceOf(accounts[0])
          .call();
        console.log(balance, "balance!!!");
        setBalance(balance);
      }
    };
    init();
  }, [bdemyTokenContract]);

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
    await contract.methods.setOnSale(course.id,0,false).send({ from: accounts[0] });
    //should update state
    window.location.reload();
  };

  const goToViewCourse = async (course) => {
    setGoTovideos({course_id:course.id});
  };

  const goToEditCourse = async (course) => {
    setGoToEdition({course_id:course.id});
  }

  return (
    <>
      <h1>Blockdemy - My Courses</h1>

      <Course
        contract={contract}
        accounts={accounts}
        courseAction={CourseActions.type_create}
      ></Course>

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
          Course Visibility: {course.visibility}
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
          ) : (
            <></>
          )}
          <Button onClick={() => goToViewCourse(course)}>View Course</Button>
          <Button onClick={() => goToEditCourse(course)}>
            Edit Course
          </Button>
          <Player
            src={"https://ipfs.infura.io/ipfs/" + course.videos_preview}
          ></Player>
          
          {goToVideos ? (<Redirect to={"/course_view/" + goToVideos.course_id} />) : (<></>)}
          {goToEdition ? (<Redirect to={"/course_edit/" + goToEdition.course_id} />) : (<></>)}

        </div>
      ))}
    </>
  );
}
