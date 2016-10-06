import npmCashay from 'npm:cashay';
import schema from '../graphql/client/schema';
import HTTPTransport from 'ember-cashay/http-transport';

const { cashay } = npmCashay;

export function startCashay(appInstance) {
  const store = appInstance.lookup('service:redux').get('store');
  const httpTransport = new HTTPTransport('/graphql');
  cashay.create({ store, schema, httpTransport });
}

export function initialize(appInstance) {
  startCashay(appInstance);
}

export default {
  name: 'ember-cashay',
  initialize
};
