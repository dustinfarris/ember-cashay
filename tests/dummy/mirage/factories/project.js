import { Factory, faker, trait } from 'ember-cli-mirage';

export default Factory.extend({
  name: faker.commerce.department,

  withTodos: trait({
    afterCreate(project, server) {
      server.createList('todo', 3, { project });
    }
  })
});
