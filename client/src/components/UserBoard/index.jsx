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
            } catch(e) {
                console.log(e)
            }
        }
    };

    return (
      <>
        {isVoter ? (
          <Center>
            <Card w={["90%", "80%", "70%", "50%", "40%"]} mt='2' >
              <CardBody>
                <Heading size='md' mb='6' >Voter Board</Heading>
                {currentStatus === 1 && (
                  <>
                    <Input placeholder='Proposal Description' name='proposal' onChange={handleChange}/>
                    <Button colorScheme='teal' size='xs' mt='2' onClick={handleClick}>
                      Add Proposal
                    </Button>
                  </>
                )}
              </CardBody>

              {currentStatus === 2 && <Proposals />}

              {currentStatus === 3 && !voter.hasVoted && <VoteSession />}

              {currentStatus === 3 && voter.hasVoted && (
                <CardBody >
                  <Heading size='sm'>The voting is in progress and you have already voted</Heading>
                </CardBody>
              )}

              {currentStatus === 4 && (
                <>
                  <CardBody >
                    <Heading size='sm'>The voting session has ended. Wait for the results. </Heading>
                  </CardBody>
                  <Proposals/>
                  <Results/>
                </>
              )}
            </Card>
          </Center>
        ) : (
          <Center>
            <Text>You are not registered as a voter.</Text>
          </Center>
        )}
      </>
    );
}

export default UserBoard;
