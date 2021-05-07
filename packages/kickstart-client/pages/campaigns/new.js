import Layout from '../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import web3 from '../../services/web3.service';
import { Factory } from '../../services/contract.service';

function NewCampaign() {
  const [minimumContribution, setMinimumContribution] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const factory = Factory();
      const accounts = await web3.eth.getAccounts();

      const campaign = await factory.methods
        .createCampaign(minimumContribution)
        .send({ from: accounts[0] });

      const address =
        campaign.events.CampaignCreated.returnValues.campaignCreated;

      router.push(`/campaigns/${address}`);
    } catch (err) {
      setErrorMessage(err.message);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <h3>Create a campaign</h3>

      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Minimum contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minimumContribution}
            onChange={(event) => setMinimumContribution(event.target.value)}
          />
        </Form.Field>

        <Message error header="Oops!" content={errorMessage}></Message>
        <Button primary type="submit" loading={loading} disabled={loading}>
          Create
        </Button>
      </Form>
    </Layout>
  );
}

export default NewCampaign;
