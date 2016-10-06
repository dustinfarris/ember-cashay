import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | something');

test('visiting /users', function(assert) {
  server.createList('user', 10);

  visit('/users');

  andThen(function() {
    assert.equal(find('.user').length, 10);
  });
});
