import { cashay } from 'cashay';
import schema from '../graphql-client/schema';
import HTTPTransport from 'ember-cashay/http-transport';
import ENV from '../config/environment';

export function startCashay(appInstance) {
  const graphqlEndpoint = ENV['ember-cashay']['graphql-endpoint'];
  const store = appInstance.lookup('service:redux').get('store');
  const httpTransport = new HTTPTransport(graphqlEndpoint);
  cashay.create({ store, schema, httpTransport });
}

export function initialize(appInstance) {
  startCashay(appInstance);
}

export default {
  name: 'ember-cashay',
  initialize
};
