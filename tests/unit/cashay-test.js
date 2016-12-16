import { module, test } from 'ember-qunit';

import {
  HTTPTransport,
  Transport,
  cashay,
  cashayReducer,
  transformSchema
} from 'cashay';

module('Unit | vendor imports | cashay');

test('it exports HTTPTransport', function(assert) {
  assert.ok(HTTPTransport);
});

test('it exports Transport', function(assert) {
  assert.ok(Transport);
});

test('it exports cashay', function(assert) {
  assert.ok(cashay);
});

test('it exports cashayReducer', function(assert) {
  assert.ok(cashayReducer);
});

test('it exports transformSchema', function(assert) {
  assert.ok(transformSchema);
});
