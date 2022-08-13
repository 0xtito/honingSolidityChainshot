const hre = require('hardhat');
const ethers = require('ethers');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const {assert} = require('chai');
const { parseUnits } = require('ethers/lib/utils');


const deposit = parseUnits("2", "wei");
describe('Party', () => {
    async function deployContract() {
      const Party = await hre.ethers.getContractFactory("Party");
      const party = await Party.deploy(deposit);
      const [ deployer, otherAccount1, otherAccount2 ] = await hre.ethers.getSigners();
      return { party, deployer, otherAccount1, otherAccount2 };
    }

    it('should allow someone to RSVP who paid exactly the amount', async () => {
      const { party, otherAccount1 } = await loadFixture(deployContract);
      await party.rsvp({value: parseUnits("2", "wei")});
      const contractBalance = await hre.ethers.provider.getBalance(party.address);
      assert.equal(contractBalance.toNumber(), deposit.toNumber());
    });

    it('should not allow someone to RSVP with less than the deposit', async () => {
      const { party, otherAccount1 } = await loadFixture(deployContract);
      let ex;
      try {
          await party.connect(otherAccount1).rsvp({ value: parseUnits("1", "wei") });
      }
      catch(_ex) {
          ex = _ex;
      }
      assert(ex, "Only paid 1 ether for an RSVP requiring a 2 ether deposit. Expected transaction to revert!");
    });

    it('should not allow someone to RSVP with more than the deposit', async () => {
      const { party, otherAccount1 } = await loadFixture(deployContract);
      let ex;
      try {
           await party.connect(otherAccount1).rsvp({ value: parseUnits("3", "wei") });
      }
      catch (_ex) {
          ex = _ex;
       }
       assert(ex, "Paid 3 ether for an RSVP requiring a 2 ether deposit. Expected transaction to revert!");
    });

    it('should not allow someone to RSVP who paid the deposit twice', async () => {
      const { party, otherAccount1 } = await loadFixture(deployContract);

      let ex;
      await party.connect(otherAccount1).rsvp({ value: parseUnits("2", "wei") });
      try {
        await party.connect(otherAccount1).rsvp({ value: parseUnits("3", "wei") });
       }
      catch (_ex) {
          ex = _ex;
       }
       assert(ex, "Attempted to pay the deposit twice from the same account. Expected transaction to revert!");
    });
});