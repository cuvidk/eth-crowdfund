// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "./CrowdfundCampaign.sol";

contract CampaignFactory {
  CrowdfundCampaign[] public campaigns;

  function createCampaign(uint minimumContribution) public {
    campaigns.push(new CrowdfundCampaign(minimumContribution, msg.sender));
  }

  function getCampaigns() public view returns(CrowdfundCampaign[] memory) {
    return campaigns;
  }
}