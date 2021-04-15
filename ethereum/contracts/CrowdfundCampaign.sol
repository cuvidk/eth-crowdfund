// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

contract CrowdfundCampaign {
  struct SpendingRequest {
    string description;
    uint value;
    address payable recipient;
    mapping(address => bool) approvals;
    uint approvalsCount;
    bool completed;
  }

  modifier ownerOnly {
    require(msg.sender == owner, "Operation reserved for owner only");
    _;
  }

  address public owner;
  uint public minimumContribution;
  mapping(address => bool) public contributors;
  uint public contributorsCount;
  SpendingRequest[] public requests;

  constructor(uint minimum, address campaignOwner) {
    minimumContribution = minimum;
    owner = campaignOwner;
  }

  function contribute() public payable {
    require(msg.value >= minimumContribution, "Contribution amount too low");
    require(!contributors[msg.sender], "You already funded this campaign");
    contributors[msg.sender] = true;
    contributorsCount++;
  }

  function createRequest(string memory description, uint value, address payable recipient) public ownerOnly {
    SpendingRequest storage request = requests.push();
    request.description = description;
    request.value = value;
    request.recipient = recipient;
    request.approvalsCount = 0;
    request.completed = false;
  }

  function approveRequest(uint id) public {
    SpendingRequest storage request = requests[id];
    require(contributors[msg.sender], "You need to contribute to the campaign before you can vote");
    require(!request.approvals[msg.sender], "You already approved this request");
    request.approvals[msg.sender] = true;
    request.approvalsCount++;
  }

  function finalizeRequest(uint id) public payable ownerOnly {
    SpendingRequest storage request = requests[id];
    require(request.value <= address(this).balance, "Balance to low to finalize the transaction");
    require(request.approvalsCount > contributorsCount / 2, "Not enough approvals");
    require(!request.completed, "Request already completed");
    request.recipient.transfer(request.value);
    request.completed = true;
  }
}