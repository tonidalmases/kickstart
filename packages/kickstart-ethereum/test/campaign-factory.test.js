const CampaignFactory = artifacts.require('CampaignFactory');

contract('CampaignFactory', (accounts) => {
  it('should deploy a factory and two campaigns', async () => {
    const factory = await CampaignFactory.deployed();

    await factory.createCampaign('100', { from: accounts[0], gas: '1000000' });
    await factory.createCampaign('100', { from: accounts[1], gas: '1000000' });

    const campaigns = await factory.getDeployedCampaigns.call();

    assert(factory);
    assert.equal(campaigns.length, 2);
  });
});
