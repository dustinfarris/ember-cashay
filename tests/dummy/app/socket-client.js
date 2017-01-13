/**
 * just a mock concept of a client lib for websockets.  you will
 * probably use something like phoenix.js or Socket.io here.
 *
 * here we just implement basic stuff for testing:
 *
 *   - send messages
 *   - register callbacks
 *   - listen for new messages
 */
import Ember from 'ember';


const { Logger } = Ember;


export class SocketConnection {

  constructor() {
    this.callbacks = {};

    this.socket = new WebSocket('ws://localhost:4000');

    this.socket.onmessage = event => {
      const { data: { topic, data } } = event;
      Logger.debug(`SOCKET CLIENT: received socket message for ${topic}`);
      if (typeof this.callbacks[topic] === 'function') {
        this.callbacks[topic](data);
      }
    };
  }

  on(topic, cb) {
    this.callbacks[topic] = cb;
    Logger.debug(`SOCKET CLIENT: listening to ${topic}`);
  }

  off(topic) {
    delete this.callbacks[topic];
    Logger.debug(`SOCKET CLIENT: no longer listening to ${topic}`);
  }

  emit(topic, data) {
    Logger.debug(`SOCKET CLIENT: sending socket message for ${topic}`);
    this.socket.send(JSON.stringify({ topic, data }));
  }

  subscribe(channelName) {
    Logger.debug('SOCKET CLIENT: preparing subscription request');
    this.emit('subscribe', channelName);
  }
}
