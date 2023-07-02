import { useState, useEffect } from "react"
import { useEth } from "../contexts/EthContext"
import UserBoard from "../components/UserBoard"
import AdminBoard from "../components/AdminBoard"

function User() {
  const {
    state: { accounts, contract },
  } = useEth();

  const [account, setAccount] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function getAccount() {
      if (accounts) {
        setAccount(accounts[0]);
      } else {

      }
    }
    async function checkAdmin() {
      const owner = await contract.methods.owner().call()
          if(accounts[0] === owner) {
              setIsAdmin(true)
          } else {
              setIsAdmin(false)
          }
    }
    checkAdmin();
    getAccount();
  }, [accounts, contract]);

  return (
    <>
      {isAdmin && (
        <AdminBoard />
      )}
      {!isAdmin && (
        <UserBoard />
      )}
    </>
  );
}

export default User;