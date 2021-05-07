import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../../../components/Layout';
import { Campaign } from '../../../../services/contract.service';
import web3 from '../../../../services/web3.service';

function NewRequest() {
  const [form, setForm] = useState({
    description: '',
    value: '',
    recipient: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const address = router.query.address;

  const handleChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    setForm({ ...form, [name]: value });
  };

  const onSubmit = async () => {
    setLoading(true);
    setErrorMessage('');

    const { description, value, recipient } = form;

    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] });

      router.push(`/campaigns/${address}/requests`);
    } catch (err) {
      setErrorMessage(err.message);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <h3>Create a request</h3>

      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </Form.Field>

        <Form.Field>
          <label>Value</label>
          <Input name="value" value={form.value} onChange={handleChange} />
        </Form.Field>

        <Form.Field>
          <label>Recipient</label>
          <Input
            name="recipient"
            value={form.recipient}
            onChange={handleChange}
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

export default NewRequest;
