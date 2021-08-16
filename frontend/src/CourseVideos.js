import React, { useEffect, useState } from "react";
import { InputGroup, FormControl, Button, Spinner } from "react-bootstrap";

export default function CourseVideos() {


  return (
      <>
        <h5>Upload the course videos</h5>
        <form
        method="post"
        encType="multipart/form-data"
      >
        <InputGroup>
          <InputGroup.Text id="basic-addon1">
            video 1:{" "}
          </InputGroup.Text>
          <FormControl
            type="file"
            name="file[]"
            multiple
            id="file"
            accept="video/mp4"
          />
        </InputGroup> 
        <Button type="submit" name="ok">
          Save course
        </Button>
      </form>
      </>
  );
}
