import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';
import npmCashay from 'npm:cashay';

const { Component, Logger } = Ember;
const { cashay } = npmCashay;

const projectsQuery = `
  {
    projects {
      id
      name
    }
  }
`;

const stateToComputed = () => {
  Logger.debug('Recomputing index route stateToComputed');
  const {
    data: { projects },
    status
  } = cashay.query(projectsQuery, {
    op: 'ProjectsList',
    mutationHandlers: {
      createProject(optimisticVariables, queryResponse, currentResponse) {
        Logger.debug('ProjectsList createProject mutation handler firing');
        if (queryResponse) {
          currentResponse.projects.push(queryResponse);
        }
        return currentResponse;
      },
      deleteProject(optimisticVariables, queryResponse, currentResponse) {
        Logger.debug(`ProjectsList deleteProject mutation handler firing`);
        if (optimisticVariables) {
          const { id } = optimisticVariables;
          const idx = currentResponse.projects.findIndex(x => x.id === id);
          currentResponse.projects.splice(idx, 1);
          return currentResponse;
        }
      }
    }
  });

  return {
    isLoading: status === 'loading',
    projects
  };
};

const ProjectsListComponent = Component.extend({
  layout: hbs`
    {{#if isLoading}}
      <h6>Loading...</h6>
    {{else}}
      {{#each projects as |project|}}
        <div class="project">
          {{link-to project.name "project" project.id}}
          <button class="delete" {{action delete project}}>Delete</button>
        </div>
      {{/each}}
    {{/if}}
  `
});

export default connect(stateToComputed)(ProjectsListComponent);
