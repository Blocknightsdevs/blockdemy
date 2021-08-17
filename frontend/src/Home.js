import React from "react";
import DisplayCourses from "./DisplayCourses";

export default function Home({
  contract,
  accounts,
  courses,
  bdemyContract,
  bdemyTokenContract,
}) {
  return (
    <>
      <h1>Blockdemy - The new way to teach and earn learning</h1>
      <DisplayCourses
        courses={courses}
        accounts={accounts}
        bdemyContract={bdemyContract}
      />
    </>
  );
}
