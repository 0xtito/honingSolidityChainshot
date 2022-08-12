// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

contract Schedule {
    struct Meeting {
        uint id;
        uint date;
    }

    Meeting[] public meetings;

    /**
     * @notice Takes a list of Meeting structs and uses them to populate the meetings array 
     * @param _meetings An array of Meetings to be filled into the storage array
     */
    constructor(Meeting[] memory _meetings) {
        for (uint i = 0; i < _meetings.length; i++) {
            meetings.push(_meetings[i]);
        }
    }

    /**
     * @dev TODO: create this function findNextMeetingDate
     * @notice finds the next meeting and returns the unix timestamp
     * @return uint unix timestamp
     */
     function findNextMeetingDate() external view returns(uint) {
         uint nextMeetingDate = 5 * block.timestamp;
         uint potentialMeetingDate;
         for (uint i = 0; i < meetings.length; i++) {
          if (meetings[i].date > block.timestamp ) {
            potentialMeetingDate = meetings[i].date;
              if (potentialMeetingDate < nextMeetingDate) {
              nextMeetingDate = potentialMeetingDate;
              }
          }
         }
         if (nextMeetingDate < block.timestamp || nextMeetingDate == 2 * block.timestamp) {
             return 0;
         }
         return nextMeetingDate;
     }
}