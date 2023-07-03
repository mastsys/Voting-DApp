import { useState, useEffect } from "react"
import { useEth } from "../../contexts/EthContext"
import { Center, Card, CardBody, Input, Heading, Button, Text } from '@chakra-ui/react'
import Proposals from "../Proposals"
import VoteSession from "../VoteSession"
import Results from "../Results";

function UserBoard() {
    const {
        state: { accounts, artifact, contract },
      } = useEth();

    const [isVoter, setIsVoter] = useState(false);
    const [voter, setVoter] = useState(0);
    const [proposalToAdd, setProposalToAdd] = useState();
    const [currentStatus, setCurrentStatus] = useState(0);
    const [userAddress, setUserAddress] = useState('');


    useEffect(() => {
        async function checkVoter() {
            try {
                const voter = await contract.methods.getVoter(accounts[0] ).call({ from: accounts[0] });
                setVoter(voter)
                setIsVoter(true)
            } catch(e) {
                setIsVoter(false)
                return
            }
        }
        async function checkStatus() {
            const status = await contract.methods.workflowStatus().call();
            setCurrentStatus(Number(status))
            //setCurrentStatus(status(3))
        }
        checkStatus();
        checkVoter();
    }, [accounts, artifact, contract]);

    const handleChange = (event) => {
        setProposalToAdd(event.target.value);
    };

    const handleClick = async () => {
        if (proposalToAdd !== "") {
            try {
                await contract.methods.addProposal(proposalToAdd).send({ from: accounts[0] })
                window.location.reload()
            } catch(e) {
                console.log(e)
            }
        }
    };

    return (
          <Center>
            <Card w={["90%", "80%", "70%", "60%", "40%"]} mt='2' >
              <CardBody>
                  {currentStatus === 0 && isVoter && (
                      <>
                      <Heading size='md' mb='6' >Voter Board</Heading>
                      <CardBody >
                          <Heading size='sm'>You have been registered by the administrator</Heading>
                          <Heading size='sm'>Please wait, the administrator is still registering the voters</Heading>
                      </CardBody>
                      </>
                  )}
                  {!isVoter && (
                      <>
                      <Heading size='md' mb='6'></Heading>
                      <CardBody >
                          <Heading size='sm'>You are not allowed to participate</Heading>
                          <Heading size='sm'>Ask the administrator to add you to the voters list for the next session</Heading>
                      </CardBody>
                      </>
                  )}
                  {currentStatus === 1 && isVoter && (
                      <>
                          <Input placeholder='Proposal Description' name='proposal' onChange={handleChange}/>
                          <Button colorScheme='teal' size='xs' mt='2' onClick={handleClick}>
                              Add Proposal
                          </Button>
                          <Proposals />
                      </>
                  )}
              </CardBody>
              {currentStatus === 2 && isVoter && (
                  <>
                  <Heading size='sm' ml='2'>Proposals Registration ended</Heading>
                  <Heading size='sm' ml='2'>Please wait, the administrator will start the vote session soon</Heading>
                      <Proposals/>
                  </>
              )}
              {currentStatus === 3 && isVoter && !voter.hasVoted && (
                  <>
                      <VoteSession/>
                  </>
              )}
              {currentStatus === 3 && isVoter && voter.hasVoted && (
                  <>    
                      <CardBody >
                          <Heading size='sm'>The voting is still in progress and you have already voted</Heading>
                      </CardBody>
                  </>
              )}
              {currentStatus === 4 && isVoter && (
                  <>
                      <CardBody >
                          <Heading size='sm'>The voting session has ended, please wait for the vote tallying.</Heading>
                      </CardBody>
                  </>
              )}
              {currentStatus === 5 && isVoter &&(
                  <>
                      <CardBody >
                          <Heading size='sm'>Vote Results</Heading>
                          <Results/>
                      </CardBody>
                  </>
              )}
          </Card>
      </Center>
    );
}

export default UserBoard;
