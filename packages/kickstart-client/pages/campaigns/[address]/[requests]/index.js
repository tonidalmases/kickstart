import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Table, Message } from 'semantic-ui-react';
import Layout from '../../../../components/Layout';
import RequestRow from '../../../../components/RequestRow';
import { Campaign } from '../../../../services/contract.service';

function Requests() {
  const [requests, setRequests] = useState([]);
  const [contributorsCount, setContributorsCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();
  const address = router.query.address;

  useEffect(async () => {
    fetchRequests();
  }, [address]);

  const fetchRequests = async () => {
    if (address) {
      const campaign = Campaign(address);
      const requestsCount = await campaign.methods.requestsCount().call();

      setRequests(
        await Promise.all(
          Array(+requestsCount)
            .fill()
            .map((_, index) => {
              return campaign.methods.requests(index).call();
            })
        )
      );

      setContributorsCount(await campaign.methods.contributorsCount().call());
    }
  };

  const renderedRows = requests.map((request, index) => {
    return (
      <RequestRow
        key={index}
        id={index}
        request={request}
        address={address}
        contributorsCount={contributorsCount}
        onErrorMessage={(message) => setErrorMessage(message)}
        onRequestApproved={fetchRequests}
        onRequestFinalized={fetchRequests}
      />
    );
  });

  const { Header, HeaderCell, Row, Body } = Table;

  return (
    <Layout>
      <h3>Requests</h3>

      <Link href={`/campaigns/${address}/requests/new`}>
        <Button primary>Add request</Button>
      </Link>

      {!!errorMessage && (
        <Message error header="Oops!" content={errorMessage}></Message>
      )}

      <Table celled>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approvals count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>

        <Body>{renderedRows}</Body>
      </Table>
    </Layout>
  );
}

export default Requests;
