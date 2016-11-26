import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

const { Component, Logger } = Ember;

export default Component.extend({
  classNames: ['project-form'],
  actions: {
    showForm() {
      Logger.debug('showing form');
      this.set('isShowingForm', true);
    },
  },
  layout: hbs`
  {{#x-btn class="show-form" on-click=(action "showForm")}}
    {{showText}}
  {{/x-btn}}
  {{#if isShowingForm}}
  {{yield (hash
    inputs=(component "project-form-inputs" changeset=changeset)
    submitBtn=(component "x-btn" class="submit" on-click=(action submit changeset))
  )}}
  {{/if}}
  `
});
