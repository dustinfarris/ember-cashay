import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  createdAt: faker.date.past(1),  // some time in the past 1 year
  description: faker.company.bs
});
