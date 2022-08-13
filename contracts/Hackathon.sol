// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";

contract Hackathon {
    struct Project {
        string title;
        uint[] ratings;
    }
    
    Project[] projects;

    // TODO: add the findWinner function
    function findWinner() external view returns(Project memory) {
        uint highestAverageRating = 0;
        Project memory highestRatedProject;

        for (uint i = 0; i < projects.length; i++) {
            uint averageRating = getAverageRating(projects[i]);
            if (averageRating > highestAverageRating) {
                highestRatedProject = projects[i];
                highestAverageRating = averageRating;
            }
        }
        return highestRatedProject;
    }
    
    function getAverageRating(Project memory project) internal pure returns(uint) {
        uint sum;
        uint count;
        uint[] memory ratings = new uint[](project.ratings.length);
        if (ratings.length == 1) return project.ratings[0];
        for (uint j = 0; j < ratings.length; j++) {
            sum += project.ratings[j];
            count++;
        }
        return sum / count;
    }

    function newProject(string calldata _title) external {
        // creates a new project with a title and an empty ratings array
        projects.push(Project(_title, new uint[](0)));
    }

    function rate(uint _idx, uint _rating) external {
        // rates a project by its index
        projects[_idx].ratings.push(_rating);
    }
}
