/**
 * This is a mock socket server that handles
 * standard graphql queries/mutations, just as
 * an http server would, and also handles
 * subscriptions when they arrive.
 */
import Ember from 'ember';

import graphqlSchema from '../graphql-server/schema';

import { Server } from 'mock-socket';
import { graphql } from 'graphql';


const { Logger } = Ember;


export default {
  name: 'mock-socket',
  initialize: function() {

    const socketServer = startMockSocket();

    // Injecting for tests
    window.socketServer = socketServer;

    const send = message => {
      socketServer.send(message);
    };

    socketServer.on('message', event => {
      Logger.debug('SOCKET SERVER: received message');
      const { topic, data } = JSON.parse(event);

      if (topic === 'graphql') {
        Logger.debug('SOCKET SERVER: received graphql request');
        const { query, variables } = data;
        graphql(graphqlSchema, query, {}, { schema: window.server.schema, socketServer }, variables).then(result => {
          const response = {
            topic: 'graphql',
            data: result
          };
          Logger.debug('SOCKET SERVER: sending graphql response');
          // Recklessly broadcasting this response to everyone
          // because we are just testing; so there is only one
          // client. In real life you will want this graphql
          // response to be delivered to the requester only.
          send(response);
        });
      } else if (topic === 'subscribe') {
        Logger.debug(`SOCKET SERVER: received subscription request for ${data}`);
        const [ channel, key ] = data.split(':');
        // Sending initial data
        const debugMessage = `SOCKET SERVER: sending initial data for ${channel}`;
        // See above comment on broadcasting
        switch (channel) {
          case "projectTodos":
            Logger.debug(debugMessage);
            send({
              topic: data,
              data: {
                type: 'add',
                objects: window.server.schema.todos.where({
                  projectId: key
                }).models.map(({ attrs: { id, description } }) => ({ id, description }))
              }
            });
            break;
          case "project":
            Logger.debug(debugMessage);
            send({
              topic: data,
              data: {
                type: 'add',
                objects: window.server.schema.projects.where({
                  id: key
                }).models.map(({ attrs: { id, name }}) => ({ id, name }))
              }
            });
            break;
          default:
            Logger.debug('SOCKET SERVER: CANCELLED! did not find channel');
        }
      }
    });
  }
}


export function startMockSocket() {
  return new Server('ws://localhost:4000');
}
