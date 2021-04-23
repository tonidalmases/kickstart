// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Campaign.sol";

contract CampaignFactory {
    Campaign[] public deployedCampaigns;
    event CampaignCreated(Campaign campaignCreated);

    function createCampaign(uint256 minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);

        emit CampaignCreated(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}
