import Ember from 'ember';
import { initialize } from 'dummy/instance-initializers/ember-cashay';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';
import ReduxService from 'dummy/services/redux';

module('Unit | Instance Initializer | ember cashay', {
  beforeEach: function() {
    Ember.run(() => {
      this.application = Ember.Application.create();
      this.appInstance = this.application.buildInstance();
      this.appInstance.register('service:redux', ReduxService);
    });
  },
  afterEach: function() {
    Ember.run(this.appInstance, 'destroy');
    destroyApp(this.application);
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  initialize(this.appInstance);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
