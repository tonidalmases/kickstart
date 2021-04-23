import web3 from './web3.service';

export const getAccounts = () => web3.eth.getAccounts();
