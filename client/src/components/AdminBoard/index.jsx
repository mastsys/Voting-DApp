import { useState, useEffect } from "react"
import { useEth } from "../../contexts/EthContext"
import { Center, Card, CardBody, Input, Heading, Button } from '@chakra-ui/react'
import Voters from "../Voters"

function AdminBoard() {
    const {
        state: { accounts, artifact, contract },
      } = useEth();

    const [isAdmin, setIsAdmin] = useState(false)
    const [currentStatus, setCurrentStatus] = useState(0)
    const [addressToAdd, setAddressToAdd] = useState('')
    const [checkResult, setCheckResult] = useState(false)

    useEffect(() => {
        async function checkAdmin() {
        const owner = await contract.methods.owner().call()
            if(accounts[0] === owner) {
                setIsAdmin(true)
            } else {
                setIsAdmin(false)
            }
        }
        async function checkStatus() {
            const status = await contract.methods.workflowStatus().call();
            setCurrentStatus(Number(status))
        }
        checkStatus();
        checkAdmin();
    }, [accounts, artifact, contract]);

    const handleChange = (event) => {
        setAddressToAdd(event.target.value);
    }

    const handleClick = async () => {
        console.log(addressToAdd);
        if (addressToAdd !== "") {
            try {
                await contract.methods.addVoter(addressToAdd).send({ from: accounts[0] })
            } catch(e) {
                alert("Please enter a valid address")
            }
        }
    }

    const changeStatus = async () => {
        console.log("Status");
        if (currentStatus === 0) {
            await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
            setCurrentStatus(1);
        } else if (currentStatus === 1) {
            await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
            setCurrentStatus(2);
        } else if (currentStatus === 2) {
            await contract.methods.startVotingSession().send({ from: accounts[0] });
            setCurrentStatus(3);
        } else if (currentStatus === 3) {
            await contract.methods.endVotingSession().send({ from: accounts[0] });
            setCurrentStatus(4);
        } else if (currentStatus === 4) {
            setCheckResult(true) 
        }
    };

    return (
        isAdmin && (
        <Center>
            <Card w="80%" mt='2'>
            {currentStatus === 0 && (
                <>
                <CardBody>
                    <Heading size='md' mb='6' >Admin Board</Heading>
                    <Input mt='4' placeholder='Voter address' name='addressToAdd' onChange={handleChange}/>
                    <Button colorScheme='teal' size='xs' mt='2' onClick={handleClick}>
                        Add Voter
                    </Button>
                    <Voters/>
                </CardBody>
                <Button colorScheme='teal' size='xs' mt='2' onClick={changeStatus}>
                        Start Proposal Registration
                </Button>
                </>
             )}
            {currentStatus === 1 && (
                <>
                <CardBody>
                    <Heading size='md' mb='6' >Admin Board - Proposal Registration in Progress</Heading>
                </CardBody>
                <Button colorScheme='teal' size='xs' mt='2' onClick={changeStatus}>
                        End Proposal Registration
                </Button>
                </>
             )}
            {currentStatus === 2 && (
                <>
                    <CardBody>
                        <Heading size='md' mb='6' >Admin Board - Proposal Registration ended</Heading>
                    </CardBody>
                    <Button colorScheme='teal' size='xs' mt='2' onClick={changeStatus}>
                            Start Voting Session
                    </Button>
                </>
             )}
            {currentStatus === 3 && (
                <>
                    <CardBody>
                        <Heading size='md' mb='6' >Admin Board - Voting Session in progress</Heading>
                    </CardBody>
                    <Button colorScheme='teal' size='xs' mt='2' onClick={changeStatus}>
                            End Voting Session 
                    </Button>
                </>
             )}
            {currentStatus === 4 && (
                <>
                    <CardBody>
                        <Heading size='md' mb='6' >Admin Board - Voting Session ended</Heading>
                    </CardBody>
                    <Button colorScheme='teal' size='xs' mt='2' onClick={changeStatus}>
                            Generate Results
                    </Button>
                </>
             )}
            </Card>
        </Center>
    )
    );
}
  
export default AdminBoard