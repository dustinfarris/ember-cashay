import Ember from 'ember';
import npmCashay from 'npm:cashay';

const { Controller, Logger } = Ember;
const { cashay } = npmCashay;

export default Controller.extend({
  actions: {
    createProject(project) {
      Logger.debug(`Creating ${project.name}!`);
      cashay.mutate('createProject', {
        variables: { name: project.name }
      });
    },
    deleteProject(project) {
      Logger.debug(`Removing ${project.name}`);
      cashay.mutate('deleteProject', {
        variables: { id: project.id }
      });
    }
  }
});
