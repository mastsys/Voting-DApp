import { useState, useEffect } from "react"
import { useEth } from "../../contexts/EthContext"
import { Heading, Button } from '@chakra-ui/react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
  } from '@chakra-ui/react'


function VoteSession() {
    const {
        state: { accounts, artifact, contract },
    } = useEth()
    const [proposals, setProposals] = useState([]);
    
    useEffect(() => {
        async function getProposals() {
            if (artifact) {
                let allproposals= [];
                const proposalsData = await contract.getPastEvents("ProposalRegistered", { fromBlock: 0})
                for (let i = 0; i <= proposalsData.length; i++) {
                    let proposalData = await contract.methods.getOneProposal(parseInt(i)).call({ from: accounts[0] })
                    let proposal = {
                        id: i,
                        description: proposalData.description,
                        voteCount: proposalData.voteCount
                    }
                    allproposals.push(proposal)
                    proposals.push(proposal)
                }
                setProposals(allproposals)
            }
        }
        getProposals()
    }, [accounts, artifact, contract])

    const handleVoteClick = async(proposalID) => {
        await contract.methods.setVote(parseInt(proposalID)).send({ from: accounts[0] })
    }

    return (
        <>
        <Heading size='sm' ml='6'>Vote Session</Heading>
        <TableContainer>
        <Table variant='striped'>
            <Thead>
            <Tr>
                <Th>Id</Th>
                <Th>Description</Th>
                <Th></Th>
            </Tr>
            </Thead>
            <Tbody>

                {proposals.map((item) => {
            return (
            <Tr key={item.id}>
                <Td>{item.id}</Td>
                <Td>{item.description}</Td>
                <Td><Button 
                        colorScheme='teal' 
                        size='xs' 
                        mt='2'
                        onClick={() => handleVoteClick(item.id)}
                    >
                        Vote
                    </Button>
                </Td>
            </Tr>
            )
        })}
            </Tbody>
        </Table>
        </TableContainer>
        </>
    );
}
  
export default VoteSession;