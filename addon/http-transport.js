import Ember from 'ember';
import npmCashay from 'npm:cashay';
import fetch from 'fetch';

const { RSVP: { Promise } } = Ember;

/**
 * A copy of Cashay's HTTPTransport, except use ember-fetch instead of
 * isomorphic-fetch.
 *
 * isomorphic-fetch uses native fetch when available, which is problematic when
 * working with libraries like ember-cli-mirage which at this time cannot
 * intercept native fetch requests.
 *
 * ember-fetch uses the polyfill fetch 100% of the time, which is something we
 * can work with.
 *
 * Additionally, we add ajax triggers to alert ember-testing that there is an
 * outstanding network request.  (This should probably be implemented in
 * ember-fetch)
 *
 * When ember-cli-mirage's dependency, Pretender, gets fetch support, this
 * class can likely be removed.
 */
export default class HTTPTransport extends npmCashay.HTTPTransport {
  constructor(...args) {
    super(...args);
    this.sendToServer = (request) => {
      const payload = Object.assign(this.init, {
        body: JSON.stringify(request),
        headers: Object.assign(this.init.headers || {}, {
          'Accept': '*/*',
          'Content-Type': 'application/json'
        }),
        method: 'POST'
      });
      return new Promise(resolve => {
        if (window.jQuery) {
          // Trigger ajaxSend so ember-testing knows there is an outstanding network request
          window.jQuery(document).trigger('ajaxSend', 'ember-cashay');
        }
        fetch(this.uri, payload).then(result => {
          const { status, statusText } = result;
          if (status >= 200 && status < 300) {
            result.json().then(json => {
              resolve(json);
            });
          } else {
            resolve({
              data: null,
              errors: [{ _error: statusText, status }]
            });
          }
        }).finally(() => {
          if (window.jQuery) {
            // Trigger ajaxComplete so ember-testing knows the request is finished
            window.jQuery(document).trigger('ajaxComplete', 'ember-cashay');
          }
        });
      });
    };
  }
}
