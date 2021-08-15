import React, { useRef, useEffect, useState } from "react";
import BlockdemyCourse from "./artifacts/contracts/BlockdemyCourse.sol/BlockdemyCourse.json";
import Blockdemy from "./artifacts/contracts/Blockdemy.sol/Blockdemy.json";
import { getWeb3 } from "./Web3/utils.js";
import { Container } from 'react-bootstrap';
import Home from "./Home";
import Videos from "./Videos";
import MyCourses from "./MyCourses";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink 
} from "react-router-dom";

//bdemy token 0x610178dA211FEF7D417bC0e6FeD39F05609AD788
const blockdemyCourseAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3";
const blockdemyAddress="0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e";

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [bdemyContract, setBdemyContract] = useState(undefined);
  const [networkId, setNetworkId] = useState(undefined);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        //console.log(web3);

        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        setNetworkId(networkId);


        const contract = new web3.eth.Contract(BlockdemyCourse.abi,blockdemyCourseAddress);
        const bdemyContract = new web3.eth.Contract(Blockdemy.abi,blockdemyAddress);

        const courses = await contract.methods.getAllCourses().call();

        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
        setBdemyContract(bdemyContract);
        setCourses(courses);
        console.log('hola');
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
              <NavLink  className="nav-link" activeClassName="nav-link active" exact  to="/">Home</NavLink >
            </li>
            <li className="nav-item">
              <NavLink  className="nav-link" activeClassName="nav-link active" to="/mycourses">My Courses</NavLink >
            </li>
          </ul>
  
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/videos/:course_id">
              <Videos contract={contract}  accounts={accounts} />
            </Route>
            <Route path="/mycourses">
              <MyCourses/>
            </Route>
            <Route path="/">
              <Home contract={contract} accounts={accounts} courses={courses} bdemyContract={bdemyContract} />
            </Route>
          </Switch>
      </Router>
  );
}

export default App;
