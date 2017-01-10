import Ember from 'ember';

import { SocketConnection } from '../socket-client';

import { Transport, cashay } from 'cashay';


const { Logger, RSVP, Route, run } = Ember;


export default Route.extend({
  /**
   * We are upgrading cashay's transport from the default http that
   * ships with ember-cashay, to a websocket "priority" transport.
   *
   * cashay will prefer the priorityTransport if it is ever provided.
   */
  beforeModel() {
    const socket = new SocketConnection();

    // Set up a "subscriber" that implements what to do when a graphql
    // query field is marked `@live`.
    //
    // The cashay query must implement a callback that resolves the field
    // into a channel and key, which will get passed to this function
    // along with some handlers that cashay provides.
    const subscriber = (channel, key, handlers) => {
      // We are going to concat the channel and key and use it to listen
      // for new messages from the server
      const channelName = `${channel}:${key}`;

      Logger.debug(`cashay is subscribing to ${channelName}`);

      // Grab the handlers that cashay provides
      const { upsert } = handlers;

      // Set up a listener
      socket.on(channelName, data => {
        run(() => {
          // Handle new messages
          if (data.type === 'add') {
            Logger.debug(`adding objects for ${channelName}`);
            data.objects.forEach(object => upsert(object));
          }
        });
      });

      socket.subscribe(channelName);

      // Return an "unsubscribe" function.
      return () => socket.off(channelName);
    };

    // Now we set up the websocket transport to handle graphql requests
    // This is for the actual graphql queries/mutations, not for the
    // subscriptions which are handled in the subscriber function above
    const sendToServer = request => {
      Logger.debug('sending cashay request to server');
      return new RSVP.Promise(resolve => {
        if (window.jQuery) {
          // Trigger ajaxSend so ember-testing knows there is an outstanding network request
          window.jQuery(document).trigger('ajaxSend', 'ember-cashay');
        }
        // sending a websocket graphql event
        Ember.Logger.debug('sending graphql request via websocket')
        // receiving a websocket graphql event
        socket.on('graphql', data => {
          Ember.Logger.debug('received graphql response via websocket')
          resolve(data);
        });
        socket.emit('graphql', request);
      }).finally(() => {
        if (window.jQuery) {
          // Trigger ajaxComplete so ember-testing knows the request is finished
          window.jQuery(document).trigger('ajaxComplete', 'ember-cashay');
        }
      });
    };
    // Create the transport
    Ember.Logger.debug('setting up priority transport');
    const priorityTransport = new Transport(sendToServer);
    // Update cashay with the new transport and subscriber
    // Note that cashay will still keep the http transport as a fallback
    // unless it is explicitly overridden
    cashay.create({ priorityTransport, subscriber });
  }
});
