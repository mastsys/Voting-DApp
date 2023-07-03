import { useState, useEffect } from "react"
import { useEth } from "../../contexts/EthContext"
import { Box } from '@chakra-ui/react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react'

import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'

function Proposals() {
    const {
        state: { accounts, artifact, contract },
      } = useEth()
    const [proposals, setProposals] = useState([])

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

    return (
        <>
            <Accordion mt='4' allowToggle>
        <AccordionItem>
            <h2>
            <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                Proposals list
                </Box>
                <AccordionIcon />
            </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
            <TableContainer>
            <Table variant='striped'>
                <Thead>
                <Tr>
                    <Th>Id</Th>
                    <Th>Description</Th>
                </Tr>
                </Thead>
                <Tbody>
                {proposals.map((item) => {
                return (
                <Tr key={item.id}>
                    <Td>{item.id}</Td>
                    <Td>{item.description}</Td>
                </Tr>
                )
            })}
            </Tbody>
            </Table>
            </TableContainer>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        </>
    );
}

export default Proposals
