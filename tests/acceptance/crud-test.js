import { test } from 'qunit';
import { moduleForAcceptance } from '../../tests/helpers/cashay';


moduleForAcceptance('Acceptance | CRUD');


// CREATE

test('creating a project', function(assert) {
  visit(`/`);

  click('.project-form .show-form');
  fillIn('.project-form .name', 'Chores');
  click('.project-form .submit');

  andThen(() => {
    assert.equal(find('.project').length, 1, 'a new project should be rendered');
    assert.equal(server.db.projects[0].name, 'Chores', 'project record should be persisted to database');
  });
});


// READ

test('reading a list of projects', function(assert) {
  server.createList('project', 10);

  visit(`/`);

  andThen(function() {
    assert.equal(find('.project').length, 10);
  });
});


test('viewing project details', function(assert) {
  const project1 = server.create('project', { name: 'IndustryMaps' });
  const project2 = server.create('project', { name: 'Progress Partners' });
  server.createList('todo', 3, { project: project1 });
  server.createList('todo', 5, { project: project2 });

  visit(`/`);

  click('a:contains(IndustryMaps)');

  andThen(() => {
    assert.equal(find('.project-name').text(), 'IndustryMaps', 'query details should be rendered');
    assert.equal(find('.project-todos .todo').length, 3, 'sub-query details should be rendered');
  });


  click('a:contains(Home)');

  click('a:contains(Progress Partners)');

  andThen(() => {
    assert.equal(find('.project-name').text(), 'Progress Partners', 'new query details should be rendered');
    assert.equal(find('.project-todos .todo').length, 5, 'new sub-query details should be rendered');
  });

});


// UPDATE

test('editing a project', function(assert) {
  const project = server.create('project', { name: 'IndustryMaps' });

  visit(`/project/${project.id}`);

  click('.project-form .show-form');
  fillIn('.project-form .name', 'Chores');
  click('.project-form .submit');

  andThen(function() {
    assert.equal(find('.project-name:contains(Chores)').length, 1, 'updated query details should be rendered');
    assert.equal(server.db.projects[0].name, 'Chores', 'project record should be updated');
  });

  visit('/');

  andThen(function() {
    assert.equal(find('a:contains(Chores)').length, 1, 'all relevant queries should update');
  });

});


// DELETE

test('removing a project', function(assert) {
  server.create('project', { name: 'IndustryMaps' });

  visit('/');

  click('a:contains(IndustryMaps) + .delete');

  andThen(function() {
    assert.equal(currentURL(), '/', 'should be redirected to index');
    assert.equal(find('.project').length, 0, 'project should not appear in index');
    assert.equal(server.db.projects.length, 0, 'project record should be deleted');
  });
});
