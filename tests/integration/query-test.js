import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';

import { startCashay } from 'dummy/instance-initializers/ember-cashay';
import { startMirage } from 'dummy/initializers/ember-cli-mirage';

const { getOwner } = Ember;

moduleForComponent('users-list', 'Integration | Component | query', {
  integration: true,
  beforeEach() {
    startCashay(getOwner(this));
    this.server = startMirage();
  },
  afterEach() {
    this.server.shutdown();
  }
});

test('it queries and displays the results', function(assert) {
  assert.expect(1);

  server.createList('user', 10);

  this.render(hbs`{{users-list}}`);

  return wait().then(() => {
    assert.equal(this.$('.user').length, 10);
  });
});
