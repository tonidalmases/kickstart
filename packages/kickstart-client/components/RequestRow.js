import { Table, Button } from 'semantic-ui-react';
import { Campaign } from '../services/contract.service';
import web3 from '../services/web3.service';

function RequestRow({
  id,
  request,
  address,
  contributorsCount,
  onErrorMessage,
  onRequestApproved,
  onRequestFinalized,
}) {
  const { Row, Cell } = Table;
  const readyToFinalize = request.approvalsCount >= contributorsCount / 2;

  const onApprove = async () => {
    onErrorMessage('');

    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.approveRequest(id).send({
        from: accounts[0],
      });

      onRequestApproved();
    } catch (err) {
      onErrorMessage(err.message);
    }
  };

  const onFinalize = async () => {
    onErrorMessage('');

    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.finalizeRequest(id).send({
        from: accounts[0],
      });

      onRequestFinalized();
    } catch (err) {
      onErrorMessage(err.message);
    }
  };

  return (
    <Row
      disabled={request.complete}
      positive={readyToFinalize || request.complete}
    >
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>
        {request.approvalsCount} / {contributorsCount}
      </Cell>
      <Cell>
        {!request.complete && (
          <Button basic color="green" onClick={onApprove}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {!request.complete && (
          <Button basic color="teal" onClick={onFinalize}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
}

export default RequestRow;
