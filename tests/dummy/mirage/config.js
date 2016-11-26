import Ember from 'ember';
import buildSchema from '../graphql-server/schema';
import npmGraphql from 'npm:graphql';
import { Response } from 'ember-cli-mirage';

const { Logger, RSVP: { Promise } } = Ember;
const graphqlSchema = buildSchema(npmGraphql);
const { graphql } = npmGraphql;

export default function() {

  Logger.debug(graphqlSchema);

  this.post('/test-graphql', (db, { requestBody }) => {
    Logger.debug(JSON.parse(requestBody));
    const { query, variables } = JSON.parse(requestBody);
    return new Promise(resolve => {
      graphql(graphqlSchema, query, {}, { db }, variables).then(result => {
        resolve(new Response(200, {}, result));
      });
    });
  });
}
