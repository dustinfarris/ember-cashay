import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

const { Component } = Ember;

export default Component.extend({
  layout: hbs`
  <input class="name" value={{changeset.name}} oninput={{action (mut changeset.name) value="target.value"}}>
  `
});
