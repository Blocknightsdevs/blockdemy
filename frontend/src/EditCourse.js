import React, { useEffect, useState } from "react";
import Course from "./Course";
import CourseActions from "./Utils/CourseActions";
import { useParams } from "react-router-dom";
import CourseVideos from "./CourseVideos";
import { Table } from "react-bootstrap";

export default function EditCourse({ contract, accounts }) {
  let { course_id } = useParams();
  const [courseData, setCourseData] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (typeof accounts != "undefined" && typeof contract != "undefined") {
        let course = await contract.methods
          .getCourseById(course_id)
          .call({ from: accounts[0] });
        setCourseData(course);
        let videos = await contract.methods
          .getVideosOfCourse(course_id)
          .call({ from: accounts[0] });
        setVideos(videos);
      }
    };

    init();
  }, [contract, accounts]);

  useEffect(() => {
    console.log("course edit did update", courseData);
  }, [courseData]);

  return (
    <>
      <h1>Blockdemy - Course Edit</h1>
      {courseData && courseData.length > 0 ? (
        <>
          <Course
            contract={contract}
            accounts={accounts}
            courseAction={CourseActions.type_edit}
            courseId={course_id}
            cData={courseData}
          ></Course>
          <CourseVideos
            contract={contract}
            accounts={accounts}
            courseId={course_id}
          />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Video Title</th>
                <th>Preview</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => {
                return (
                  <tr>
                    <td>{video.title} </td> 
                    <td> Preview </td>
                    <td> edit - view - delete </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      ) : (
        <div>Loading data</div>
      )}
    </>
  );
}
