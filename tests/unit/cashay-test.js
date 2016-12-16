import { module, test } from 'ember-qunit';

import { cashay } from 'cashay';

module('Unit | vendor imports | cashay');

test('it exports cashay', function(assert) {
  assert.ok(cashay);
});
