import { useState, useEffect } from "react"
import { useEth } from "../../contexts/EthContext"
import { Heading } from '@chakra-ui/react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
  } from '@chakra-ui/react'

function Voters() {
  const {
    state: { accounts, contract, artifact },
  } = useEth()
  const [voters, setVoters] = useState([])

  useEffect(() => {
    async function getVoters() {
      if (artifact) {
        let addresses = []
        const votersData = await contract.getPastEvents("VoterRegistered", { fromBlock: 0})
        for (let i = 0; i < votersData.length; i++) {
            addresses.push({id: i, address: votersData[i].returnValues.voterAddress})
        }
        setVoters(addresses);
      }
    }
    getVoters()
  }, [accounts, contract, artifact])

  return (
    <>
        <Heading size='sm' mt='8' ml='6'>Voters List</Heading>
        <TableContainer mt='4'>
        <Table variant='striped'>
            <Thead>
            <Tr>
                <Th>Id</Th>
                <Th>Address</Th>
            </Tr>
            </Thead>
            <Tbody>
            {voters.map((item) => {
            return (
            <Tr key={item.id}>
                <Td>{item.id}</Td>
                <Td>{item.address}</Td>
            </Tr>
            )
        })}
        </Tbody>
        </Table>
        </TableContainer>
    </>
  );
}

export default Voters;
