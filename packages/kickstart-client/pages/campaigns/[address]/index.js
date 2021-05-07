import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { Button, Card, Grid } from 'semantic-ui-react';
import Link from 'next/link';
import ContributeForm from '../../../components/ContributeForm';
import { Campaign } from '../../../services/contract.service';
import web3 from '../../../services/web3.service';

const buildCards = (summary) => {
  return [
    {
      header: summary.manager,
      meta: 'Address of the manager',
      description: 'The created this campaign.',
      style: { overflowWrap: 'break-word' },
    },
    {
      header: summary.minimumContribution,
      meta: 'Minimum contribution (wei)',
      description:
        'You must contribute at least theis much wei to become an approver.',
    },
    {
      header: summary.requestsCount,
      meta: 'Number of requests',
      description:
        'A request tries to withdraw money from the contract. Requests must be approved.',
    },
    {
      header: summary.contributorsCount,
      meta: 'Number of contributors',
      description: 'Number of people who have already donated to the campaign.',
    },
    {
      header: web3.utils.fromWei(summary.balance, 'ether'),
      meta: 'Campaign balance (ether)',
      description: 'The balance is how much money this campaign has.',
    },
  ];
};

function ShowCampaign() {
  const [cards, setCards] = useState();

  const router = useRouter();
  const address = router.query.address;

  useEffect(async () => {
    fetchSummary();
  }, [address]);

  const fetchSummary = async () => {
    if (address) {
      const campaign = Campaign(address);
      const summary = await campaign.methods.getSummary().call();

      setCards(buildCards(summary));
    }
  };

  return (
    <Layout>
      <h3>Campaign details</h3>

      <Grid>
        <Grid.Row>
          <Grid.Column width="10">
            <Card.Group items={cards} />
          </Grid.Column>
          <Grid.Column width="6">
            <ContributeForm
              address={address}
              onContributionSuccess={fetchSummary}
            ></ContributeForm>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${address}/requests`}>
              <Button primary>Requests</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
}

export default ShowCampaign;
