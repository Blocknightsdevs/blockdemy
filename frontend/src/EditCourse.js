import React, { useEffect, useState } from "react";
import Course from "./Course";
import CourseActions from "./Utils/CourseActions";
import { useParams } from "react-router-dom";
import CourseVideos from './CourseVideos';

export default function EditCourse({ contract, accounts }) {

  let { course_id } = useParams();
  const [courseData, setCourseData] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const init = async () => {

        if(typeof accounts!='undefined' && typeof contract!='undefined'){
            let course = await contract.methods.getCourseById(course_id).call({ from: accounts[0] });
            setCourseData(course);
            let videos = await contract.methods.getVideosOfCourse(course_id).call({ from: accounts[0] });
            setVideos(videos);
        }
      
    };

    init();
  }, [contract,accounts]);

  useEffect(() => {

    console.log("course edit did update",courseData);
  }, [courseData]);


  return (
    <>
      <h1>Blockdemy - Course Edit</h1>
      {courseData && courseData.length > 0 ?
      <>
        <Course
            contract={contract}
            accounts={accounts}
            courseAction={CourseActions.type_edit}
            courseId={course_id}
            cData={courseData}
        ></Course>
        <CourseVideos contract={contract} accounts={accounts} courseId={course_id}/>
        {videos.map(video => { return <div>video {video.title } - delete - view</div>})}
      </>
      : <div>Loading data</div>}
    </>
  );
}
