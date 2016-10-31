import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

const { Component } = Ember;

const UsersTableComponent = Component.extend({
  layout: hbs`
  {{#each users as |user|}}
  <div class="user">{{user.name}}</div>
  {{/each}}
  `
});

export default UsersTableComponent;
