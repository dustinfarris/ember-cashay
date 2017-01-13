import Ember from 'ember';
import graphqlSchema from '../graphql-server/schema';
import { graphql } from 'graphql';
import { Response } from 'ember-cli-mirage';

const { Logger, RSVP: { Promise } } = Ember;

export default function() {

  Logger.debug(graphqlSchema);

  this.post('/test-graphql', (schema, { requestBody }) => {
    Logger.debug(JSON.parse(requestBody));
    const { query, variables } = JSON.parse(requestBody);
    return new Promise(resolve => {
      graphql(graphqlSchema, query, {}, { schema }, variables).then(result => {
        resolve(new Response(200, {}, result));
      });
    });
  });
}
