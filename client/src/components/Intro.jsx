import { useState, useEffect } from "react"
import { useEth } from "../contexts/EthContext"
import { Center, Card, Text, CardBody } from '@chakra-ui/react'

function User() {
  const {
    state: { accounts },
  } = useEth();
  const [account, setAccount] = useState("");

  useEffect(() => {
    async function getAccount() {
      if (accounts) {
        setAccount(accounts[0]);
      } else {

      }
    };
    getAccount();
  }, [accounts]);

  return (
    <Center>
        <Card w="80%" mt='2'>
                <CardBody >
                    <Text>Your address is : {account} </Text>
                </CardBody>
        </Card>
    </Center>
  );
}

export default User;