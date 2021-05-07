import web3 from './web3.service';
import { factory, campaign } from 'kickstart-ethereum';

const factoryAddress = '0x38632B955aA12c1Ef92B1f8fcb432d912aC6D408';

export const Factory = () => new web3.eth.Contract(factory, factoryAddress);

export const Campaign = (address) => new web3.eth.Contract(campaign, address);
