import { useState, useEffect } from "react";
import { useEth } from "../../contexts/EthContext";
import { Heading, Text } from '@chakra-ui/react';

import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'

  import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'  

function WinningProposal() {
    const {
        state: { accounts, contract },
    } = useEth();

    const [winningProposal, setWinningProposal] = useState(null);
    const [allProposals, setAllProposals] = useState(null);
    const [allVotes, setAllVotes] = useState(null);

    useEffect(() => {
        async function getWinningProposal() {
            try {

                let voters = []
                const voterData = await contract.getPastEvents("VoterRegistered", { fromBlock: 0})
                for (let i = 0; i < voterData.length; i++) {
                    voters.push({voterAddress : voterData[i].returnValues.voterAddress})      
                }

                let votes = []
                const voteData = await contract.getPastEvents("Voted", { fromBlock: 0})
                for (let i = 0; i < voteData.length; i++) {
                    votes.push({
                        voterAddress : voteData[i].returnValues.voter,
                        proposalId: voteData[i].returnValues.proposalId
                    })      
                }
                setAllVotes(votes)

                console.log(votes)
                let proposals = [];
                const proposalsData = await contract.getPastEvents("ProposalRegistered", { fromBlock: 0})
                for (let i = 0; i <= proposalsData.length; i++) {
                    let proposalData = await contract.methods.getOneProposal(parseInt(i)).call({ from: voters[0].voterAddress })
                    let proposal = {
                        id: i,
                        description: proposalData.description,
                        voteCount: proposalData.voteCount
                    }
                    proposals.push(proposal)
                    setAllProposals(proposals)
                }

                let winningProposal = null;
                let maxVoteCount = 0;
                for (let i = 0; i < proposals.length; i++) {
                  const proposal = proposals[i];
                  const voteCount = parseInt(proposal.voteCount);
                  
                  if (voteCount > maxVoteCount) {
                    maxVoteCount = voteCount;
                    winningProposal = proposal;
                  }
                }
                setWinningProposal(winningProposal);
            } catch (e) {
                console.log(e);
            }
        }
        getWinningProposal();
    }, [accounts, contract]);

    return (
        <>
            {winningProposal && (
                <>
                    <Heading size='sm' ml='6' mb='' textAlign="center">Winning Proposal</Heading>
                    <TableContainer>
                    <Table variant='striped' colorScheme='teal'>
                        <Thead>
                        <Tr>
                            <Th>Id</Th>
                            <Th>Description</Th>
                            <Th isNumeric>Vote Count</Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                        <Tr>
                            <Td>{winningProposal.id}</Td>
                            <Td>{winningProposal.description}</Td>
                            <Td isNumeric>{winningProposal.voteCount}</Td>
                        </Tr>
                        </Tbody>
                    </Table>
                    </TableContainer>
                    <Heading size='sm' ml='6' mt='4' textAlign="center">Results</Heading>
            <TableContainer>
            <Table variant='striped'>
                <Thead>
                <Tr>
                    <Th>Id</Th>
                    <Th>Description</Th>
                    <Th>Vote Count</Th>
                </Tr>
                </Thead>
                <Tbody>
                {allProposals.map((item) => {
                return (
                <Tr key={item.id}>
                    <Td>{item.id}</Td>
                    <Td>{item.description}</Td>
                    <Td>{item.voteCount}</Td>
                </Tr>
                )
            })}
            </Tbody>
            </Table>
            </TableContainer>
            <Heading size='sm' ml='6' mt='4' textAlign="center">Detailed votes</Heading>
            <TableContainer>
            <Table variant='striped'>
                <Thead>
                <Tr>
                    <Th>Voter</Th>
                    <Th>Proposal Id</Th>
                </Tr>
                </Thead>
                <Tbody>
                {allVotes.map((item) => {
                return (
                <Tr key={item.id}>
                    <Td>{item.voterAddress}</Td>
                    <Td>{item.proposalId}</Td>
                </Tr>
                )
            })}
            </Tbody>
            </Table>
            </TableContainer>
                </>
            )}
        </>
    );
}

export default WinningProposal;
