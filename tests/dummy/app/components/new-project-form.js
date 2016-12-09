import Changeset from 'ember-changeset';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

const { Component } = Ember;

export default Component.extend({
  project: { name: '' },

  init() {
    this._super(...arguments);
    this.changeset = new Changeset(this.get('project'));
  },

  actions: {
    save(changeset) {
      changeset.execute();
      this.sendAction('createProject', this.get('project'));
    }
  },

  layout: hbs`
  {{#project-form changeset=changeset showText="New Project" submit=(action "save") as |form|}}
    {{form.inputs}}
    {{#form.submitBtn}}Create project!{{/form.submitBtn}}
  {{/project-form}}
  `
});
