import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

const { Component } = Ember;

export default Component.extend({
  actions: {
    save(changeset) {
      this.sendAction('updateProject',
        Object.assign({}, this.get('project'), changeset.get('change'))
      );
    }
  },

  layout: hbs`
  {{#project-form changeset=(changeset project) showText="Edit Project" submit=(action "save") as |form|}}
    {{form.inputs}}
    {{#form.submitBtn}}Edit!{{/form.submitBtn}}
  {{/project-form}}
  `
});
