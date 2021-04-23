const factoryContract = require('./build/contracts/CampaignFactory.json');
const campaignContract = require('./build/contracts/Campaign.json');

module.exports = {
  factory: factoryContract.abi,
  campaign: campaignContract.abi,
};
