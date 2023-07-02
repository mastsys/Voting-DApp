import { useState, useEffect } from "react";
import { useEth } from "../../contexts/EthContext";
import { Heading, Text } from '@chakra-ui/react';

function WinningProposal() {
    const {
        state: { accounts, contract },
    } = useEth();

    const [winningProposal, setWinningProposal] = useState(null);

    useEffect(() => {
        async function getWinningProposal() {
            try {
                let winningProposalId = await contract.methods.winningProposalID().call();
                let proposalData = await contract.methods.getOneProposal(winningProposalId).call({ from: accounts[0] });
                let proposal = {
                    id: winningProposalId,
                    description: proposalData.description,
                    voteCount: proposalData.voteCount
                }
                setWinningProposal(proposal);
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
                    <Heading size='sm' ml='6' mt='3'>Winning Proposal</Heading>
                    <Text>Id: {winningProposal.id}</Text>
                    <Text>Description: {winningProposal.description}</Text>
                    <Text>Vote Count: {winningProposal.voteCount}</Text>
                </>
            )}
        </>
    );
}

export default WinningProposal;
