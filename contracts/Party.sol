// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Party {

    mapping (address => bool) alreadyRsvp;
    address[] members;
    uint public paymentAmount;

    event PayedBilled(address indexed, uint indexed);

    constructor(uint _paymentAmount) {{
        paymentAmount = _paymentAmount;
    }}

    function rsvp() payable external {
        require(msg.value == paymentAmount, "Not the correct payment amount!");
        require(!alreadyRsvp[msg.sender], "Already RSVPed!");
        alreadyRsvp[msg.sender] = true;
        members.push(msg.sender);
    }

    function payBill(address recipient, uint amount) external {
        uint owed = amount - address(this).balance;
        (bool success, ) = recipient.call{ value: owed }("");
        require(success, "tx failed");
        emit PayedBilled(recipient, amount);
        redistributeLeftover();
    }

    function redistributeLeftover() internal {
        bool success;
        uint amountForEach = address(this).balance / (members.length - 1);
        for (uint i = 0; i < members.length; i++) {
            (success, ) = members[i].call{value: amountForEach}("");
            require(success);
        }
    }
}