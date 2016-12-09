import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';
import npmCashay from 'npm:cashay';

const { Component, Logger } = Ember;
const { cashay } = npmCashay;

const projectQuery = `
  {
    project(id: $project_id) {
      id
      name
      todos {
        id
        createdAt
        description
      }
    }
  }
`;

const stateToComputed = (state, attrs) => {
  Logger.debug(`Recomputing project detail stateToComputed for id: ${attrs.project_id}`);
  const { data: { project } } = cashay.query(projectQuery, {
    op: 'ProjectDetail',
    key: attrs.project_id,
    mutationHandlers: {
      updateProject(optimisticVariables, queryResponse, currentResponse) {
        Logger.debug('ProjectDetail updateProject mutation handler firing');
        if (queryResponse) {
          currentResponse.project = queryResponse;
          return currentResponse;
        }
      }
    },
    variables: { project_id: attrs.project_id }
  });
  return { project };
};

const ProjectDetailComponent = Component.extend({
  layout: hbs`
    <h2 class="project-name">{{project.name}}</h2>

    {{edit-project-form project=project updateProject=(action update)}}

    <h3>Todos</h3>
    <ul class="project-todos">
      {{#each project.todos as |todo|}}
        <li class="todo">
          <p>{{todo.description}}</p>
          <div><small>{{todo.createdAt}}</small></div>
        </li>
      {{/each}}
    </ul>
  `
});

export default connect(stateToComputed)(ProjectDetailComponent);
