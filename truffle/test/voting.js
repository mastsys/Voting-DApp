const Voting = artifacts.require("Voting");
const { BN , expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract("Voting", () => {

    contract("At deployment", () => {
        let votingInstance;

        beforeEach(async () => {
            votingInstance = await Voting.new();
        });

        it("should have 0 winning proposal.", async () => {
            const result = await votingInstance.winningProposalID();
           expect(result.toString()).to.equal(new BN(0).toString());
        });

        it("should get RegisteringVoters (index=0) as default WorkflowStatus.", async () => {
            const result = await votingInstance.workflowStatus();
           expect(result.toString()).to.equal(new BN(0).toString());
        });
    });

    contract("non-registered voters", () => {
      let votingInstance, owner, other;

      beforeEach(async () => {
          [owner, other] = await web3.eth.getAccounts();
          votingInstance = await Voting.new();
      });

      it("prevent from getting voters.", async () => {
          await expectRevert(
              votingInstance.getVoter(other, { from: owner }),
              "You're not a voter"
          );
      });

      it("prevent from getting proposals.", async () => {
          await expectRevert(
              votingInstance.getOneProposal(777, { from: owner }),
              "You're not a voter"
          );
      });

      it("prevent from adding proposals.", async () => {
          await expectRevert(
              votingInstance.addProposal("proposal1", { from: other }),
              "You're not a voter"
          );
      });

      it("prevent from setting votes.", async () => {
          await expectRevert(
              votingInstance.setVote(0, { from: other }),
              "You're not a voter"
          );
      });
    });

    contract("non-owners", () => {
      let votingInstance, owner, other;

      beforeEach(async () => {
          [owner, other] = await web3.eth.getAccounts();
          votingInstance = await Voting.new();
      });

      it("prevent from adding voters.", async () => {
          await expectRevert(
              votingInstance.addVoter(other, { from: other }),
              "Ownable: caller is not the owner"
          );
      });

      it("prevent from starting proposal registration.", async () => {
          await expectRevert(
              votingInstance.startProposalsRegistering({ from: other }),
              "Ownable: caller is not the owner"
          );
      });

      it("prevent from ending proposal registration.", async () => {
          await expectRevert(
              votingInstance.endProposalsRegistering({ from: other }),
              "Ownable: caller is not the owner"
          );
      });

      it("prevent from starting vote session.", async () => {
          await expectRevert(
              votingInstance.startVotingSession({ from: other }),
              "Ownable: caller is not the owner"
          );
      });

      it("prevent from ending vote session.", async () => {
          await expectRevert(
              votingInstance.endVotingSession({ from: other }),
              "Ownable: caller is not the owner"
          );
      });

      it("prevent from tally votes.", async () => {
          await expectRevert(
              votingInstance.tallyVotes({ from: other }),
              "Ownable: caller is not the owner"
          );
      });
  });


    contract("With workflowStatus = RegisteringVoters", () => {
      let votingInstance, owner, other;

      beforeEach(async () => {
          [owner, other] = await web3.eth.getAccounts();
          votingInstance = await Voting.new();
      });

      it("prevent from computing tally votes with incorrect workflowStatus.", async () => {
          await expectRevert(
              votingInstance.tallyVotes({ from: owner }),
              "Current status is not voting session ended"
          );
      });

      it("owner can start proposal registration and emit an event.", async () => {
        const receipt = await votingInstance.startProposalsRegistering({ from: owner });
        expectEvent.inLogs(receipt.logs, "WorkflowStatusChange", { previousStatus: new BN(0).toString(), newStatus: new BN(1).toString() });
      });


      it("owner can add voters and emit an event.", async () => {
          const receipt = await votingInstance.addVoter(other, { from: owner });
          expectEvent(receipt, "VoterRegistered", { voterAddress: other });
      });

      it("prevent from adding an existing registered voter.", async () => {
          await votingInstance.addVoter(other, { from: owner });
          await expectRevert(
              votingInstance.addVoter(other, { from: owner }),
              "Already registered"
          );
      });
  });


    contract("With workflowStatus = ProposalsRegistrationStarted", () => {
      let votingInstance, owner, other;

      beforeEach(async () => {
          [owner, other] = await web3.eth.getAccounts();
          votingInstance = await Voting.new();
          await votingInstance.addVoter(other, { from: owner });
          await votingInstance.startProposalsRegistering({ from: owner });
      });

      it("prevent from starting registration with incorrect workflowStatus.", async () => {
          await expectRevert(
              votingInstance.startProposalsRegistering({ from: owner }),
              "Registering proposals cant be started now"
          );
      });

      it("prevent from adding voter.", async () => {
          await expectRevert(
              votingInstance.addVoter(other, { from: owner }),
              "Voters registration is not open yet"
          );
      });

      it("registered voter can add proposals.", async () => {
        const receipt = await votingInstance.addProposal("proposal1", { from: other });
        expectEvent(receipt, 'ProposalRegistered');
    });

      it("prevent from adding an empty proposal.", async () => {
          await expectRevert(
              votingInstance.addProposal("", { from: other }),
              "Vous ne pouvez pas ne rien proposer"
          );
      });

      it("owner can stop proposal registration and emit an event.", async () => {
          const receipt = await votingInstance.endProposalsRegistering({ from: owner });
          expectEvent(receipt, "WorkflowStatusChange", { previousStatus: new BN(1), newStatus: new BN(2) });
      });
  });


    contract("With workflowStatus = ProposalsRegistrationEnded", () => {
      let votingInstance, owner, voter;

      beforeEach(async () => {
          [owner, voter] = await web3.eth.getAccounts();
          votingInstance = await Voting.new();
          await votingInstance.addVoter(voter, { from: owner });
          await votingInstance.startProposalsRegistering({ from: owner });
          await votingInstance.endProposalsRegistering({ from: owner });
      });

      it("prevent from stopping registration with incorrect workflowStatus.", async () => {
          await expectRevert(
              votingInstance.endProposalsRegistering({ from: owner }),
              "Registering proposals havent started yet"
          );
      });

      it("prevent from adding proposal.", async () => {
          await expectRevert(
              votingInstance.addProposal("proposal1", { from: voter }),
              "Proposals are not allowed yet"
          );
      });

      it("owner can start vote session and emit an event.", async () => {
          const receipt = await votingInstance.startVotingSession({ from: owner });
          expectEvent(receipt, "WorkflowStatusChange", { previousStatus: new BN(2), newStatus: new BN(3) });
      });
  });


    contract("With workflowStatus = VotingSessionStarted", () => {
      let votingInstance, owner, other;

      beforeEach(async () => {
          [owner, other] = await web3.eth.getAccounts();
          votingInstance = await Voting.new({ from: owner });
          await votingInstance.addVoter(other, { from: owner });
          await votingInstance.startProposalsRegistering({ from: owner });
          await votingInstance.addProposal("proposal1", { from: other });
          await votingInstance.endProposalsRegistering({ from: owner });
          await votingInstance.startVotingSession({ from: owner });
      });

      it("prevent from starting registration with incorrect workflowStatus.", async () => {
          await expectRevert(
              votingInstance.startVotingSession({ from: owner }),
              "Registering proposals phase is not finished"
          );
      });

      it("registered voter can vote for proposals.", async () => {
          const receipt = await votingInstance.setVote(new BN("0"), { from: other });
          expectEvent(receipt, 'Voted');
      });

      it("prevent registered voter from voting twice.", async () => {
          await votingInstance.setVote(new BN("0"), { from: other });
          await expectRevert(
              votingInstance.setVote(new BN("0"), { from: other }),
              "You have already voted"
          );
      });

      it("prevent registered voter from voting invalid proposal.", async () => {
          await expectRevert(
              votingInstance.setVote(new BN("1777"), { from: other }),
              "Proposal not found"
          );
      });

      it("owner can stop vote session.", async () => {
          const receipt = await votingInstance.endVotingSession({ from: owner });
          expectEvent(receipt, 'WorkflowStatusChange', { previousStatus: new BN("3"), newStatus: new BN("4") });
      });
    });


      contract("With workflowStatus = VotingSessionEnded", () => {
        let votingInstance, owner, voter1, voter2;

        beforeEach(async () => {
            [owner, voter1, voter2] = await web3.eth.getAccounts();
            votingInstance = await Voting.new({ from: owner });
            await votingInstance.addVoter(voter1, { from: owner });
            await votingInstance.addVoter(voter2, { from: owner });
            await votingInstance.startProposalsRegistering({ from: owner });
            await votingInstance.addProposal("proposal1", { from: voter1 });
            await votingInstance.addProposal("proposal2", { from: voter2 });
            await votingInstance.endProposalsRegistering({ from: owner });
            await votingInstance.startVotingSession({ from: owner });
            await votingInstance.setVote(new BN("1"), { from: voter1 });
            await votingInstance.endVotingSession({ from: owner });
        });

        it("prevent from stopping vote session with incorrect workflowStatus.", async () => {
            await expectRevert(
                votingInstance.endVotingSession({ from: owner }),
                "Voting session havent started yet"
            );
        });

        it("prevent from voting.", async () => {
            await expectRevert(
                votingInstance.setVote(new BN("1"), { from: voter1 }),
                "Voting session havent started yet"
            );
        });

        it("owner can compute tally votes and emit an event.", async () => {
            const receipt = await votingInstance.tallyVotes({ from: owner });
            expectEvent(receipt, 'WorkflowStatusChange', { previousStatus: new BN("4"), newStatus: new BN("5") });
        });

        it("registered voter can get voter information, has voted", async () => {
            const voter = await votingInstance.getVoter(voter1, { from: voter1 });
            assert(voter.isRegistered);
            assert(voter.hasVoted);
            assert.equal(voter.votedProposalId.toString(), new BN("1").toString());
        });

        it("registered voter can get voter information, has not voted", async () => {
            const voter = await votingInstance.getVoter(voter2, { from: voter1 });
            assert(voter.isRegistered);
            assert(!voter.hasVoted);
            assert.equal(voter.votedProposalId.toString(), new BN("0").toString());
        });

        it("registered voter can get a proposal", async () => {
            const proposal0 = await votingInstance.getOneProposal(new BN("0"), { from: voter1 });
            assert.equal(proposal0.description, "GENESIS");
            assert.equal(proposal0.voteCount.toString(), new BN("0").toString());

            const proposal1 = await votingInstance.getOneProposal(new BN("1"), { from: voter1 });
            assert.equal(proposal1.description, "proposal1");
            assert.equal(proposal1.voteCount.toString(), new BN("1").toString());

            const proposal2 = await votingInstance.getOneProposal(new BN("2"), { from: voter1 });
            assert.equal(proposal2.description, "proposal2");
            assert.equal(proposal2.voteCount.toString(), new BN("0").toString());
        });
    });

});
