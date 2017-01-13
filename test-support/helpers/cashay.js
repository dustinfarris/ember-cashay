import { module } from 'qunit';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

import { cashay } from 'cashay';

const { RSVP: { Promise } } = Ember;


/**
 * When websockets are introduced, their async nature can
 * create a lot of testing headaches.  This waiter function
 * alleviates some of that by making Ember pause until all
 * cashay queries and subscriptions have been resolved.
 *
 * This doesn't guarantee that all socket events have been
 * collected, but it at least helps ensure that expected
 * responses have been received.
 */
export const waitForSubscriptions = function() {
  // This checks for pending queries (that may be waiting for live data)
  let loadingQueriesKeys = Object.keys(cashay.cachedQueries).filter(opName => {
    let op = cashay.cachedQueries[opName];
    let loadingResponsesKeys = Object.keys(op.responses).filter(key => {
      let response = op.responses[key];
      // cashay leaves the response status as "loading" when it's marked @live
      // ideally, I'd like this to change to "subscribed" or something so I
      // know if the query is truly pending a server response.  Until then, we
      // will have to manually check cachedSubscriptions

      // response could be undefined if it was flushed
      if (!response || response.status !== "loading") {
        return false;
      } else {
        // Taking the first field, hopefully the only one
        let fieldName = Object.keys(response.data)[0];
        let field = response.data[fieldName];

        let cachedSubscription = cashay.cachedSubscriptions[`${fieldName}::${field.id}`];

        if (cachedSubscription && cachedSubscription.status === "ready") {
          // This is just a live query, we do not need to hold anything up
          return false;
        }

        // otherwise a loading response is something to wait for
        return true;
      }
    });
    return loadingResponsesKeys.length > 0;
  });

  // This checks for subscriptions that are still pending
  let subscribingSubscriptionsKeys = Object.keys(cashay.cachedSubscriptions).filter(channelName => {
    return cashay.cachedSubscriptions[channelName].status === "subscribing";
  });

  /*
  if (loadingQueriesKeys.length > 0) {
    console.log(loadingQueriesKeys);
  }

  if (subscribingSubscriptionsKeys.length > 0) {
    console.log(subscribingSubscriptionsKeys);
  }
  */

  return loadingQueriesKeys.length === 0 && subscribingSubscriptionsKeys.length === 0;
}


export const moduleForAcceptance = function(name, options = {}) {
  module(name, {
    before() {
      Ember.Test.registerWaiter(waitForSubscriptions);
    },
    after() {
      Ember.Test.unregisterWaiter(waitForSubscriptions);
    },
    beforeEach() {
      this.application = startApp();

      if (options.beforeEach) {
        return options.beforeEach.apply(this, arguments);
      }
    },
    afterEach() {
      let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
      return Promise.resolve(afterEach).then(() => {
        destroyApp(this.application)

        // Reset cashay
        cashay.clear();

        // Shutdown the mock socket server
        if (typeof window.socketServer !== "undefined") {
          window.socketServer.stop();
          delete window.socketServer;
        }

        // Shutdown pretender
        if (typeof window.server !== "undefined") {
          window.server.shutdown();
          delete window.server;
        }
      });
    }
  });
}
