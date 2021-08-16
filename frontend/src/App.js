import React, { useRef, useEffect, useState } from "react";
import BlockdemyCourse from "./artifacts/contracts/BlockdemyCourse.sol/BlockdemyCourse.json";
import BlockdemyToken from "./artifacts/contracts/BlockdemyToken.sol/BlockdemyToken.json";
import Blockdemy from "./artifacts/contracts/Blockdemy.sol/Blockdemy.json";
import { getWeb3 } from "./Web3/utils.js";
import { Container } from "react-bootstrap";
import Home from "./Home";
import Videos from "./Videos";
import MyCourses from "./MyCourses";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

const blockdemyCourseAddress = "0x5133BBdfCCa3Eb4F739D599ee4eC45cBCD0E16c5";
const blockdemyTokenAddress = "0x71089Ba41e478702e1904692385Be3972B2cBf9e";
const blockdemyAddress = "0x8F4ec854Dd12F1fe79500a1f53D0cbB30f9b6134";

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [bdemyContract, setBdemyContract] = useState(undefined);
  const [bdemyTokenContract, setBdemyTokenContract] = useState(undefined);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();

        const accounts = await web3.eth.getAccounts();

        const contract = new web3.eth.Contract(
          BlockdemyCourse.abi,
          blockdemyCourseAddress
        );
        const bdemyContract = new web3.eth.Contract(
          Blockdemy.abi,
          blockdemyAddress
        );
        const tokenContract = new web3.eth.Contract(
          BlockdemyToken.abi,
          blockdemyTokenAddress
        );

        const _courses = await contract.methods.getAllCourses().call();

        let copy = [..._courses];
        
        copy.sort((a,b) => parseInt(b.visibility)-parseInt(a.visibility));

        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
        setBdemyContract(bdemyContract);
        setBdemyTokenContract(tokenContract);
        setCourses(copy);
      } catch (e) {}
    };
    init();

    if (web3) {
      window.ethereum.on("accountsChanged", (accounts) => {
        //console.log('changed',accounts);
        if (accounts.length == 0) {
          window.location.reload();
        }
      });
    }
  }, []);


  return (
    <Router>
      <ul className="nav nav-pills">
        <li className="nav-item">
          <NavLink
            className="nav-link"
            activeClassName="nav-link active"
            exact
            to="/"
          >
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link"
            activeClassName="nav-link active"
            to="/mycourses"
          >
            My Courses
          </NavLink>
        </li>
      </ul>

      {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/videos/:course_id">
          <Videos contract={contract} accounts={accounts} />
        </Route>
        <Route path="/mycourses">
          <MyCourses />
        </Route>
        <Route path="/">
          <Home
            contract={contract}
            accounts={accounts}
            courses={courses}
            bdemyContract={bdemyContract}
            bdemyTokenContract={bdemyTokenContract}
          />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
