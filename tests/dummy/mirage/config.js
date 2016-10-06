import Ember from 'ember';
import buildSchema from '../graphql/server/schema';
import npmGraphql from 'npm:graphql';
import { Response } from 'ember-cli-mirage';

const { Logger, RSVP: { Promise } } = Ember;
const graphqlSchema = buildSchema(npmGraphql);
const { graphql } = npmGraphql;

export default function() {

  Logger.debug(graphqlSchema);

  this.post('/graphql', (mirageSchema, { requestBody }) => {
    const { query, variables } = JSON.parse(requestBody);
    return new Promise(resolve => {
      variables.mirage = mirageSchema;
      graphql(graphqlSchema, query, {}, variables).then(result => {
        resolve(new Response(200, {}, result));
      });
    });
  });
}
