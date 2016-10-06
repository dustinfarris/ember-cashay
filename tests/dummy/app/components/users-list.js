import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';
import npmCashay from 'npm:cashay';

const { Component } = Ember;
const { cashay } = npmCashay;

const stateToComputed = () => {
  const { users } = cashay.query(`{ users { id, name } }`).data;
  return { users };
};

const UsersListComponent = Component.extend({
  layout: hbs`
  {{users-table users=users}}
  `
});

export default connect(stateToComputed)(UsersListComponent);
