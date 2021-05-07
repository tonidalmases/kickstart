const CampaignFactory = artifacts.require('CampaignFactory');
const Campaign = artifacts.require('Campaign');

contract('Campaign', (accounts) => {
  let campaign;

  beforeEach(async () => {
    const factory = await CampaignFactory.deployed();
    const campaignTx = await factory.createCampaign('100', {
      from: accounts[0],
      gas: '1000000',
    });

    campaign = await Campaign.at(campaignTx.logs[0].args.campaignCreated);
  });

  it('should mark caller as the campaign manager', async () => {
    const manager = await campaign.manager.call();

    assert.equal(manager, accounts[0]);
  });

  it('should allow people to contribute money and mark them as contributors', async () => {
    await campaign.contribute({ from: accounts[1], value: '200' });

    const isContributor = await campaign.contributors.call(accounts[1]);

    assert(isContributor);
  });

  it('should require a minimum contribution', async () => {
    try {
      await campaign.contribute({ from: accounts[1], value: '10' });
    } catch (e) {
      assert(true);
      return;
    }
    assert(false);
  });

  it('should allow a manager to make a payment request', async () => {
    await campaign.createRequest('Buy batteries', '100', accounts[1], {
      from: accounts[0],
      gas: '1000000',
    });

    const request = await campaign.requests.call(0);

    assert.equal(request.description, 'Buy batteries');
    assert.equal(request.value, '100');
    assert.equal(request.recipient, accounts[1]);
    assert.equal(request.complete, false);
    assert.equal(request.approvalsCount, '0');
  });

  it('should get the summary', async () => {
    const summary = await campaign.getSummary.call();

    assert.equal(summary.manager, accounts[0]);
    assert.equal(summary.minimumContribution, 100);
    assert.equal(summary.contributorsCount, 0);
    assert.equal(summary.balance, 0);
    assert.equal(summary.requestsCount, 0);
  });

  it('should get the contributors count', async () => {
    await campaign.contribute({ from: accounts[1], value: '200' });
    await campaign.contribute({ from: accounts[2], value: '200' });

    const count = await campaign.contributorsCount.call();

    assert.equal(count, 2);
  });

  it('should get requests count', async () => {
    await campaign.createRequest(
      'Buy batteries',
      web3.utils.toWei('5', 'ether'),
      accounts[1],
      {
        from: accounts[0],
        gas: '1000000',
      }
    );

    const count = await campaign.requestsCount.call();

    assert.equal(count, 1);
  });

  it('should process a request', async () => {
    await campaign.createRequest(
      'Buy batteries',
      web3.utils.toWei('5', 'ether'),
      accounts[1],
      {
        from: accounts[0],
        gas: '1000000',
      }
    );

    await campaign.contribute({
      from: accounts[2],
      value: web3.utils.toWei('10', 'ether'),
    });
    await campaign.approveRequest(0, {
      from: accounts[2],
      gas: '1000000',
    });

    await campaign.finalizeRequest(0, {
      from: accounts[0],
      gas: '1000000',
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
