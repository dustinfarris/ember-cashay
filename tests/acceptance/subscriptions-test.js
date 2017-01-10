import { test } from 'qunit';
import { moduleForAcceptance } from '../../tests/helpers/cashay';


moduleForAcceptance('Acceptance | Subscriptions');


test('subscription updates', function(assert) {
  const project = server.create('project', { name: 'IndustryMaps' });
  server.createList('todo', 3, { project });

  visit(`/project/${project.id}`);

  andThen(() => {
    assert.equal(find('.project-todos .todo').length, 3, 'initial todos should be rendered');

    // A new todo has arrived on the server!  Notify clients!
    window.socketServer.send({
      topic: `projectTodos:${project.id}`,
      data: {
        type: 'add',
        objects: [{
          id: "1234567",
          description: "Freshly Minted Todo!"
        }]
      }
    });

    andThen(() => {
      assert.equal(find('.project-todos .todo').length, 4, 'a new todo should be rendered');
    });
  });
});
