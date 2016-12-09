import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

const { Component } = Ember;

export default Component.extend({
  classNames: ['btn'],
  tagName: 'button',
  click() {
    this.sendAction('on-click');
  },
  layout: hbs`
  {{yield}}
  `
});
