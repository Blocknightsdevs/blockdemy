import React, { useRef, useEffect, useState } from "react";
import BlockdemyCourse from "./contracts/BlockdemyCourse.json";
import Blockdemy from "./contracts/Blockdemy.json";
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

        const deployedNetwork = BlockdemyCourse.networks[networkId];
        const contract = new web3.eth.Contract(
          BlockdemyCourse.abi,
          deployedNetwork && deployedNetwork.address
        );

        const deployedBdemyNetwork = Blockdemy.networks[networkId];
        const bdemyContract = new web3.eth.Contract(
          Blockdemy.abi,
          deployedBdemyNetwork && deployedBdemyNetwork.address
        );
      
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
