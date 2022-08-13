const hre = require('hardhat');
const ethers = require('ethers');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const {assert} = require('chai');
const { parseUnits } = require('ethers/lib/utils');


describe('Hackathon', () => {
  async function deployContract() {
    const Hackathon = await hre.ethers.getContractFactory("Hackathon");
    const hackathon = await Hackathon.deploy();

    return { hackathon };
  }
  describe('with a single project', () => {
    const projectName = 'Only';
    it('should award the sole participant', async () => {
      const { hackathon } = await loadFixture(deployContract);
      await hackathon.newProject(projectName);
      await hackathon.rate(0, 4);
      const winner = await hackathon.findWinner();
      assert.equal(winner.title, projectName);
    });
  });

  describe('with multiple projects', () => {
    describe('and a single judge', () => {
    const participant1 = 'First';
    const expectedWinner = 'Winning';
    const participant2 = 'Second';
      it('should return the highest rated project', async () => {
        const { hackathon } = await loadFixture(deployContract);
        await hackathon.newProject(participant1);
        await hackathon.newProject(expectedWinner);
        await hackathon.newProject(participant2);
        await hackathon.rate(0, 4);
        await hackathon.rate(1, 5);
        await hackathon.rate(2, 2);
        const actualWinner = await hackathon.findWinner();
        assert.equal(actualWinner.title, expectedWinner);
      });
    });
        
    describe('and multiple judges', async () => {
        const expectedWinner = 'Winning';
        const participant2 = 'second';
        const participant3 = 'third';
        const projects = [
          [participant2, [2, 2, 2, 2, 2, 2]],
          [participant3, [0, 4]],
          [expectedWinner, [2, 3, 4]],
        ];

      async function deployWithMutipleJudges() {
        const { hackathon } = await loadFixture(deployContract);
        projects.map( async ([title, ratings], idx) => {
          await hackathon.newProject(title);
          await ratings.map( async (rating) => {
            await hackathon.rate(idx, rating);
          })
        });
        return { hackathon };
      }

      it('should award the highest average', async () => {
        const { hackathon } = await loadFixture(deployContract);
        await hackathon.newProject(expectedWinner);
        await hackathon.newProject(participant2);
        await hackathon.newProject(participant3);
        await hackathon.rate(0, 5);
        await hackathon.rate(0, 10);
        await hackathon.rate(0, 15);
        await hackathon.rate(1, 20);
        await hackathon.rate(1, 20);
        await hackathon.rate(1, 20);
        await hackathon.rate(2, 2);
        await hackathon.rate(2, 2);
        await hackathon.rate(0, 2);

        // TODO: Fix errors from this
        // projects.map( async ([title, ratings], idx) => {
        //   await hackathon.newProject(title);
        //   await ratings.map( async (rating) => {
        //     await hackathon.rate(idx, rating);
        //   })
        // });
        
        const actualWinner = await hackathon.findWinner();
        assert.equal(actualWinner.title, participant2);
      });
    });
  });
});
