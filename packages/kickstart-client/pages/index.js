import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { getFactoryContract } from '../services/contract.service';

function Index() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(async () => {
    const factory = getFactoryContract();
    const deployedCampaigns = await factory.methods
      .getDeployedCampaigns()
      .call();

    setCampaigns(
      deployedCampaigns.map((address) => ({
        header: address,
        description: (
          <Link href={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      }))
    );
  }, []);

  return (
    <Layout>
      <h3>Open campaigns</h3>

      <Card.Group items={campaigns} />
    </Layout>
  );
}

export default Index;
