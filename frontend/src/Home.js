import React from "react";
import Course from "./Course";
import DisplayCourses from "./DisplayCourses";
export default function Home({contract,accounts,courses,bdemyContract}) {
    return (
        <>
            <h1>Blockdemy</h1>
            <Course contract={contract} accounts={accounts}></Course>
            <DisplayCourses courses={courses} accounts={accounts} contract={contract}  bdemyContract={bdemyContract} />
    </>)
}