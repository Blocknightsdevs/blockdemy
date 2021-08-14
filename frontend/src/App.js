import React, { useRef, useEffect, useState } from "react";
import Course from "./Course";
import DisplayCourses from "./DisplayCourses";
import BlockdemyCourse from "./contracts/BlockdemyCourse.json";
import { getWeb3 } from "./Web3/utils.js";
import { Container } from "react-bootstrap";

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
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
        const courses = await contract.methods.getAllCourses().call();

        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
        if(courses) setCourses(courses);
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
    <Container className="App">
      <Course contract={contract} accounts={accounts}></Course>
      <DisplayCourses
        accounts={accounts}
        contract={contract}
        courses={courses}
        accounts={accounts}
      />
    </Container>
  );
}

export default App;
