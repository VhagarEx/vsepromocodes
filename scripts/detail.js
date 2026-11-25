import { offers } from './offers.js';
import { openOffer } from './offer-dialog.js';

document.querySelector('#show-code').addEventListener('click', () => openOffer(offers[0]));
