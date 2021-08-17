import React, { useEffect, useState } from "react";
import { Player } from "video-react";
import { useParams } from "react-router-dom";

export default function ViewCourse({ contract, accounts }) {
  let { course_id } = useParams();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (typeof accounts != "undefined" && typeof contract != "undefined") {
        console.log("videos did mount", contract);
        let videos = await contract.methods
          .getVideosOfCourse(course_id)
          .call({ from: accounts[0] });
        setVideos(videos);
      }
    };

    init();
  }, [contract, accounts]);

  return (
    <>
      <h1>Blockdemy - View Course</h1>
      {videos && videos.length > 0 ? (
        videos.map((video) => {
          return (
            <>
              <h3>{video.title}</h3>
              <Player src={"https://ipfs.infura.io/ipfs/" + video.uri}></Player>
            </>
          );
        })
      ) : (
        <div>No videos to show</div>
      )}
    </>
  );
}
