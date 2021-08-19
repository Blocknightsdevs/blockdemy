import React, { useEffect, useState } from "react";
import Course from "./Course";
import Web3 from "web3";
import { Button, Input } from "react-bootstrap";
import ModalSale from "./ModalSale";
import { Player } from "video-react";
import { Redirect } from "react-router-dom";
import CourseActions from "./Utils/CourseActions";
import ModalVisibility from "./ModalVisibility";

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
  const [courseToIncreaseVisibility, setCourseToIncreaseVisibility] = useState({});
  const [approvedAllowance, setApprovedAllowance] = useState(false);
  const [allowance, setAllowance] = useState(false);


  useEffect(() => {
    const init = async () => {
      await checkAllowance();
    };
    init();
  }, [allowance]);

  useEffect(() => {
    const init = async () => {
      if (typeof bdemyTokenContract != "undefined") {
        let balance = await bdemyTokenContract.methods
          .balanceOf(accounts[0])
          .call();
        console.log(balance, "balance!!!");
        setBalance(balance);
        await callAllowance();
      }
    };
    init();
  }, [bdemyTokenContract]);


  const callAllowance = async () => {
    if (typeof bdemyTokenContract != "undefined") {
      let allowance = await bdemyTokenContract.methods
        .allowance(accounts[0], bdemyContract._address)
        .call();
        console.log(allowance);
      setAllowance(allowance);
    }
  }

  const checkAllowance = async () => {
      if(allowance > 0){
        setApprovedAllowance(true);
      }
  };

  const isEmpty = (obj) => {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  };

  const approve = async () => {
    let totalSupply = await bdemyTokenContract.methods.totalSupply().call();

    await bdemyTokenContract.methods
      .approve(bdemyContract._address, totalSupply)
      .send({ from: accounts[0] });

    await callAllowance();
  };

  const increaseVisibility = async (course) => {
    setCourseToIncreaseVisibility(course);
  };

  const notMoreOnSale = async (course) => {
    await contract.methods
      .setOnSale(course.id, 0, false)
      .send({ from: accounts[0] });
    //should update state
    window.location.reload();
  };

  const goToViewCourse = async (course) => {
    setGoTovideos({ course_id: course.id });
  };

  const goToEditCourse = async (course) => {
    setGoToEdition({ course_id: course.id });
  };

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
          {!isEmpty(courseToIncreaseVisibility) ? (
            <ModalVisibility
              course={courseToIncreaseVisibility}
              setCourseToIncreaseVisibility={setCourseToIncreaseVisibility}
              balance={balance}
              bdemyContract={bdemyContract}
              accounts={accounts}
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
          Royalty: {course.royalty} %
          <br></br>
          <br></br>
          Visibility: {course.visibility}
          <br></br>
          {accounts && accounts[0] == course.owner && !course.onSale ? (
            <Button onClick={() => setCourseOnSale(course)}>Put On Sale</Button>
          ) : accounts && accounts[0] == course.owner && course.onSale ? (
            <>
              <Button onClick={() => notMoreOnSale(course)}>
                Not More On Sale
              </Button>
              {approvedAllowance && balance>0? (
                <Button
                  onHov
                  onClick={() => increaseVisibility(course)}
                >
                  Increase Visibility
                </Button>
              ) : !approvedAllowance && <Button onClick={() => approve()}>Approve to increase visibility</Button>}
            </>
          ) : (
            <></>
          )}
          <Button onClick={() => goToViewCourse(course)}>View Course</Button>
          {accounts && accounts[0] == course.owner && (
            <Button onClick={() => goToEditCourse(course)}>Edit Course</Button>
          )}
          <Player
            src={"https://ipfs.infura.io/ipfs/" + course.videos_preview}
          ></Player>
          {goToVideos ? (
            <Redirect to={"/course_view/" + goToVideos.course_id} />
          ) : (
            <></>
          )}
          {goToEdition ? (
            <Redirect to={"/course_edit/" + goToEdition.course_id} />
          ) : (
            <></>
          )}
        </div>
      ))}
    </>
  );
}
