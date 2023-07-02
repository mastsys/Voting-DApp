import { useState, useEffect } from "react";
import { Button, Text } from "@chakra-ui/react";
import Web3Modal from "web3modal";
import Web3 from "web3";
import { useEth } from "../contexts/EthContext";
import UserBoard from "../components/UserBoard";
import AdminBoard from "../components/AdminBoard";

// Web3Modal setup
const providerOptions = {}; // Optional. Add supported wallets here.
const web3Modal = new Web3Modal({
  network: "development",
  cacheProvider: true,
  providerOptions,
});

function User() {
  const {
    state: { accounts, contract },
  } = useEth();

  const [account, setAccount] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const connectWallet = async () => {
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]); // store the first account in state
  };

  const disconnectWallet = async () => {
    web3Modal.clearCachedProvider(); // this will clear the selected provider
    setAccount(""); // reset the account state in your app
  };

  useEffect(() => {
    async function getAccount() {
      if (accounts) {
        setAccount(accounts[0]);
      }
    }
    async function checkAdmin() {
      const owner = await contract.methods.owner().call();
      if (accounts[0] === owner) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
    checkAdmin();
    getAccount();
  }, [accounts, contract]);

  return (
    <>
      {account ? (
        <>
          <Button onClick={disconnectWallet}>Disconnect Wallet</Button>
          <Text>Connected: {account}</Text>
          {isAdmin && <AdminBoard />}
          {!isAdmin && <UserBoard />}
        </>
      ) : (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )}
    </>
  );
}

export default User;
