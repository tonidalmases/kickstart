import web3 from './web3.service';
import { factory, campaign } from 'kickstart-ethereum';

const factoryAddress = '0x18EED8B1F4212446921Eee33E5880cEa880233dF';

export const getFactoryContract = () =>
  new web3.eth.Contract(factory, factoryAddress);

export const getCampaignContract = (address) =>
  new web3.eth.Contract(campaign, address);
