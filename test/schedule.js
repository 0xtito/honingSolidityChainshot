const hre = require('hardhat');
const ethers = require('ethers');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const {assert} = require('chai');


function generateDate(seconds, older = false) {
    const now = Date.now() / 1000;
    return Math.floor(now + (seconds * (older ? -1 : 1)));
}

describe('Schedule', () => {
    async function deployContract1() {
      const meeting = { id: 1, date: generateDate(10) }
      const Schedule = await hre.ethers.getContractFactory('Schedule');
      const contract = await Schedule.deploy([meeting]);
      return {contract, meeting};
    }

    describe('with a single meeting in the future', () => {
        it('should return the future date', async () => {
          const { contract, meeting } = await loadFixture(deployContract1); 
            let nextMeeting = await contract.findNextMeetingDate();
            // console.log(nextMeeting.toNumber());
            assert.equal(nextMeeting.toNumber(), meeting.date);
        });
    });

    describe('with no meetings in the future', () => {
        const pastDates = [generateDate(10, true), generateDate(100, true), generateDate(1000, true)];
        async function deployContract2() {
          const meetings = pastDates.map((date, i) => ({ id: i + 1, date }));
          const Schedule = await hre.ethers.getContractFactory('Schedule');
          const contract = await Schedule.deploy(meetings);
          return {contract};
        }

        it('should return zero', async () => {
          const {contract} = await loadFixture(deployContract2);
          let nextMeeting = await contract.findNextMeetingDate();
          assert.equal(nextMeeting.toNumber(), 0);
        });
    });

    describe('with meetings in the future and the past', () => {
        const pastDates = [generateDate(10, true), generateDate(100, true), generateDate(1000, true)];
        const futureDates = [generateDate(100), generateDate(10), generateDate(1000)];
        async function deployContract3() {
          const meetings = pastDates.concat(futureDates).map((date, i) => ({ id: i + 1, date }));
          const Schedule = await hre.ethers.getContractFactory('Schedule');
          const contract = await Schedule.deploy(meetings);
          return {contract};
        }

        it('should return the nearest meeting date', async () => {
          const {contract} = await loadFixture(deployContract3);
          let nextMeeting = await contract.findNextMeetingDate();
          // assert(nextMeeting.toNumber(), "Did not return a future meeting");
          assert.equal(nextMeeting.toNumber(), futureDates[1], 'Did not return the next upcoming meeting');
        });
    });
});
