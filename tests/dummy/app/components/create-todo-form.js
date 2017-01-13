import Ember from 'ember';
import connect from 'ember-redux/components/connect';
import hbs from 'htmlbars-inline-precompile';

import { cashay } from 'cashay';


const { Component } = Ember;


const EMPTY_TODO = {
  description: ''
};


const CreateTodoForm = Component.extend({

  todo: EMPTY_TODO,

  reset() {
    this.set('todo', EMPTY_TODO);
  },

  actions: {
    createTodo(todo) {
      const project_id = this.get('project.id');
      cashay.mutate('createTodo', {
        variables: {
          ...todo,
          project_id
        }
      });
      this.reset();
    }
  },

  layout: hbs`

  <h4>New Todo</h4>
  {{input value=todo.description placeholder="Description"}}
  <button {{action "createTodo" todo}}>Create</button>

  `


});


export default connect()(CreateTodoForm);
