import { Form, Button, Input, Message } from 'semantic-ui-react';
import { useState } from 'react';
import web3 from '../services/web3.service';
import { Campaign } from '../services/contract.service';

function ContributeForm({ address, onContributionSuccess }) {
  const [contribution, setContribution] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contribution, 'ether'),
      });

      setContribution('');
      onContributionSuccess();
    } catch (err) {
      setErrorMessage(err.message);
    }

    setLoading(false);
  };

  return (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
      <Form.Field>
        <label>Contribution</label>
        <Input
          label="ether"
          labelPosition="right"
          value={contribution}
          onChange={(event) => setContribution(event.target.value)}
        />
      </Form.Field>

      <Message error header="Oops!" content={errorMessage}></Message>
      <Button primary type="submit" loading={loading} disabled={loading}>
        Contribute
      </Button>
    </Form>
  );
}

export default ContributeForm;
