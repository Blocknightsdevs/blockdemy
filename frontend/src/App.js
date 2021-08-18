import React, { useRef, useEffect, useState  } from "react";
import BlockdemyCourse from "./artifacts/contracts/BlockdemyCourse.sol/BlockdemyCourse.json";
import BlockdemyToken from "./artifacts/contracts/BlockdemyToken.sol/BlockdemyToken.json";
import Blockdemy from "./artifacts/contracts/Blockdemy.sol/Blockdemy.json";
import { getWeb3 } from "./Utils/Web3.js";
import { Container } from "react-bootstrap";
import Home from "./Home";
import ViewCourse from "./ViewCourse";
import MyCourses from "./MyCourses";
import EditCourse from "./EditCourse";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

const blockdemyCourseAddress="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const blockdemyTokenAddress="0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const blockdemyAddress="0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [bdemyContract, setBdemyContract] = useState(undefined);
  const [bdemyTokenContract, setBdemyTokenContract] = useState(undefined);
  const [courses, setCourses] = useState([]);
  const [mycourses, setMyCourses] = useState([]);

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
        
        const _mycourses = await contract.methods
          .getMyCourses()
          .call({ from: accounts[0] });

        let copy = [..._courses];

        copy.sort((a, b) => parseInt(b.visibility) - parseInt(a.visibility));

        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
        setBdemyContract(bdemyContract);
        setBdemyTokenContract(tokenContract);
        setCourses(copy);
        setMyCourses(_mycourses);
        
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
        <Route path="/course_edit/:course_id">
          <EditCourse contract={contract} accounts={accounts} />
        </Route>
        <Route path="/course_view/:course_id">
          <ViewCourse contract={contract} accounts={accounts} />
        </Route>
        <Route path="/mycourses">
          <MyCourses
            contract={contract}
            accounts={accounts}
            mycourses={mycourses}
            bdemyTokenContract={bdemyTokenContract}
            bdemyContract={bdemyContract}
          />
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
