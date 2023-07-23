import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [contractOwner, setContractOwner] = useState(undefined); 

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async() => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(balance.toNumber());
    }
  };
  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  // New function to fetch the contract owner's address
  const getContractOwner = async () => {
    if (atm) {
      const ownerAddress = await atm.getOwner();
      setContractOwner(ownerAddress);
    }
  };
  const checkContractStatus = async () => {
    if (atm) {
      const isOpen = await atm.isContractOpen();
      alert(isOpen ? "Contract is open" : "Contract is closed");
    }
  };
  
  const closeContract = async () => {
    if (atm) {
      await atm.closeContract();
      alert("Contract closed successfully");
      // You can also update the UI or perform other actions after closing the contract
    }
  };
  

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p> install Metamask </p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>
        connect Metamask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    if (contractOwner === undefined) {
      getContractOwner(); // Fetch the contract owner's address
    }

    return (
      <div>
        <p> Account: {account}</p>
        <p>Balance: {balance}</p>
        <p>Contract Owner: {contractOwner}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <button onClick={checkContractStatus}>Check Contract Status</button> {/* New button */}
        <button onClick={closeContract}>Close Contract</button> {/* New button */}
      </div>
    );
  }

  useEffect(() => { getWallet(); }, []);

  return (
    <main className="container">
      <header>
        <h1>Smart Contract Integration with Frontend!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: #f3f3f3; /* Light gray background color */
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow */
          max-width: 400px; /* Limit the container width */
          margin: 0 auto; /* Center the container horizontally */
        }
  
        header {
          background-color: #007bff; /* Blue header background color */
          color: #fff;
          padding: 15px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
  
        h1 {
          margin: 0;
        }
  
        p {
          margin: 10px 0;
        }
  
        .button-container {
          margin-top: 20px;
        }
  
        .button-container button {
          margin: 10px;
          padding: 10px 20px;
          font-size: 16px;
          background-color: #007bff;
          color: #fff;
          border: none;
          cursor: pointer;
          border-radius: 5px;
        }
  
        .button-container button:hover {
          background-color: #0056b3;
        }
  
        .wallet-status {
          margin-top: 20px;
          padding: 10px;
          background-color: #f1f1f1;
          border-radius: 5px;
        }
  
        .error {
          color: #f00;
          font-weight: bold;
        }
  
        .success {
          color: #0c0;
          font-weight: bold;
        }
      `}</style>
    </main>
  );
      }
    
